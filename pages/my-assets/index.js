/* pages/my-assets.js */
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {NFTAddress, MarketAddress} from '../../config'

import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Product from '../../components/single-components/Product'
import ProductLoadAnim from '../../components/single-components/ProductLoadAnim'

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        loadNFTs()
    }, [])
    // Fetch my Tokens 
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
        // network: "mainnet",
        // cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(MarketAddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider)
        // Fetching User's NFT
        const data = await marketContract.fetchMyNFTs()
        // Getting Items from User Address 
        const items = await Promise.all( data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
        }
        return item
        }))
        setNfts(items)
        setLoaded(true) 
    }
    if (loaded && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
    return (
        <React.Fragment>
            <div className="bg-white">
                <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    {/* Heading */}
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">My Collections</h2>
                    {/* Products */}
                    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        { loaded ? nfts?.map((nft,key) => ( <Product product={nft} key={key}/> )) : [...Array(4)].map((e, key) =>(<ProductLoadAnim key={key}/>)) }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}