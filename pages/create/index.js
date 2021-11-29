import React,{useState, useEffect} from "react";
import router from "next/router";
import Image from "next/dist/client/image";
import Head from 'next/head'
import { ethers } from "ethers";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3Modal from 'web3Modal';
// Addresses
import {NFTAddress, MarketAddress} from "../../config"
// ABI's
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
// Moralis
import {useMoralis} from "react-moralis"


const create = () => {
    const [fileUrl, setFileUrl] = useState('')
    const [formInput, setFormInput] = useState({ price: '', name: '', description: '' })
    // Moralis
    const { authenticate, user, Moralis } = useMoralis();
    
    // Upload file [i.e. Image] to IPFS
    async function handleUploadImage( event ){
        const data = event.target.files[0]
        try {
          const file = new Moralis.File(data.name, data)
          file = await file.saveIPFS();
          setFileUrl(file.ipfs())
        } catch (error) {
          console.log('Error Uplading Image to IPFS:', error)
        }
    }
    // Creating Item and Saving it to IPFS
    async function createItem(e) {
      e.preventDefault();
      const {name, description, price} = formInput
      // Return if there is no name, price, description or file URL
      if (!name || !description || !price || !fileUrl) return
      const metadata = {
          "name": name,
          "description": description,
          "image": fileUrl
      }
      // Save Token Metadata to IPFS
      try {
        const file = new Moralis.File("file.json", {base64 : btoa(JSON.stringify(metadata))});
        file = await file.saveIPFS();
        createSale(file.ipfs())
      } catch (error) {
        console.log('Error in Uplading Token MetaData to IPFS:', error)
      }
    }

    // Creating listing of Item for Sale
    async function createSale(url) {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      // NFT Contract
      let contract = new ethers.Contract(NFTAddress, NFT.abi, signer)
      // Creating a new Token[i.e. NFT]
      let transaction = await contract.createToken(url) // createToken is Function from NFT - Contract
      let tx = await transaction.wait() // wait for transaction to complete...
      // Getting Token Id
      let event = tx.events[0]
      let value = event?.args[2]
      let tokenId = value.toNumber()
      // Getting Token Price
      const price = ethers.utils.parseUnits(formInput.price, 'ether')
      // Market Contract
      contract = new ethers.Contract(MarketAddress, Market.abi, signer)
      let listingPrice = await contract.getListingPrice() // getListingPrice is Function from NFTMarket - Contract
      listingPrice = listingPrice.toString()
      // Listing Item for Sale
      transaction = await contract.createMarketItem(
        NFTAddress, tokenId, price, {value:listingPrice}
       ) // createMarketItem is Function from NFTMarket - Contract
      await transaction.wait() // wait for transaction to complete...
      // Sending User back to Home Page
      router.push('/')
    }

    // useEffect called on page load...
    useEffect(() => {
      authenticate()
    }, [])

    return (
        <div>
          {console.log("User:", user)}
        <div className="md:grid md:grid-cols-3 md:gap-6 p-4">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create your Token, Now!</h3>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form action="#" method="POST">
              <div className=" shadow-lg sm:rounded-md sm:overflow-hidden">

                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    {/* Name */}
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">
                            Name 
                        </label>
                        <input
                            id="email" 
                            name="name"
                            className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-100 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" 
                            placeholder="Item Name" 
                            onChange={ event => setFormInput({ ...formInput, name: event.target.value})}
                        />
                    </div>
                    {/* Desccription */}
                    <div>
                        <label htmlFor="email" className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">
                            Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-full flex items-center p-3 text-sm border-gray-300 rounded border shadow" 
                                placeholder="Provide a detailed description of your item." 
                                onChange={ event => setFormInput({ ...formInput, description: event.target.value})}
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                        Brief description for your profile. URLs are hyperlinked.
                        </p>
                    </div>
                    {/* Price */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">
                            Price
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-50 text-gray-500 text-sm">
                                ethers
                            </span>
                            <input
                                type="text"
                                name="company-website"
                                id="company-website"
                                className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-full flex items-center p-3 text-sm border-gray-300 rounded border shadow"
                                placeholder="0.0"
                                onChange={ event => setFormInput({ ...formInput, price: event.target.value})}
                            />
                       </div>
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        { fileUrl ? <Image width="150" height="150" className="w-full" alt="image of a girl posing"  src={fileUrl} /> :
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        } 
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only"  
                              onChange={handleUploadImage}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={ event => createItem(event)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        </div>
    );
};
export default create;
