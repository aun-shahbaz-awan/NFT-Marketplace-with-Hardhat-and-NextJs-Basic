import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {AiFillTag} from 'react-icons/ai'
import { NFTAddress } from '../../config'

const Product = ({product, onBuy}) => {
    if(product.description){
        let description = product.description
        let count = 55
        description = description.slice(0, count) + (description.length > count ? "..." : "");
    }

    return (
        <React.Fragment>
            <div className="relative shadow-md rounded-md">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-t-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                {console.log(product)}
                                <Link href={`/assets/${NFTAddress}/${product.tokenId}`}>
                                    <a>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                            // layout="responsive"
                                            width={500}
                                            height={600}
                                        />
                                    </a>
                                 </Link>
                            </div>
                            <div className="flex justify-between p-4">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        {/* <a href={`/assets/${product.tokenId}`}> */}
                                            {/* <span aria-hidden="true" className="absolute inset-0" /> */}
                                            {product.name} 
                                        {/* </a> */}
                                    </h3>
                                    { product.description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : ""}
                                </div>
                                <p className="text-sm font-medium text-gray-900">#{product.tokenId}</p>
                            </div>
                        
                <div className="flex justify-between p-4" onClick= {() => onBuy(product)}>
                    <button className="inline-flex justify-center py-2 px-4 w-full border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <AiFillTag className="mt-auto mb-auto"/> &nbsp; Buy {product.price} ETH
                    </button>
                </div>
                        
                        </div>

        </React.Fragment>            

    )
}
export default Product