import Link from "next/link"
import { GiFrozenBlock } from "react-icons/gi";
import { IoMdAddCircle } from "react-icons/io";

const Header = () => {
    return (
    <div className="bg-indigo-600 m-3 rounded-lg">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">

                <div className="w-0 flex-1 flex items-center">
                    <span className="flex p-2 rounded-lg bg-indigo-800">
                        <GiFrozenBlock className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>


                            <div className="ml-3 hidden md:inline rounded-md shadow-sm items-center w-8/12 ">
                                            <input
                                                type="text"
                                                name="price"
                                                id="price"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block pl-7 pr-12 lg:text-sm h-10 w-full pt-1 pb-1 border-gray-300 rounded-md"
                                                placeholder="Search items, collections and accounts"
                                            />
                            </div>


                </div>

                {/* Marketplace NFT's */}
                <div className="order-1 flex-shrink-0 sm:order-1 sm:ml-3">
                    <Link href='/'>
                        <button type="button" className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                            <strong className="text-white">Explore</strong>
                        </button>
                    </Link>
                </div>

                <div className="order-1 flex-shrink-0 sm:order-2 sm:ml-3">
                    <Link href='/creater-dashboard'>
                        <button type="button" className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                            <strong className="text-white">Creater Dashboard</strong>
                        </button>
                    </Link>
                </div>
                {/* */}
                <div className="order-1 flex-shrink-0 sm:order-3 sm:ml-3">
                    <Link href='/my-assets'>
                        <button type="button" className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                            <strong className="text-white">My Collection</strong>
                        </button>
                    </Link>
                </div>
                {/* Create NFT */}
                <div className="order-1 mt-2 ml-4 flex-shrink-0 w-full sm:order-4 sm:mt-0 sm:w-auto">
                    <Link href='/create'>
                        <a href="#" className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                            <IoMdAddCircle className="h-4 w-4 text-indigo-600" aria-hidden="true" />&nbsp; Create
                        </a>
                    </Link>
                </div>

            </div>
        </div>
    </div>
    )
}
export default Header;

