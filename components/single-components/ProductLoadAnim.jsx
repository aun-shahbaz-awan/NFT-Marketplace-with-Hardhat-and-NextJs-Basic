
import React from 'react'

const ProductLoadAnim = () => {
    return (
        <div className="relative shadow-md rounded-md">
            <div class="animate-pulse">
                <div className="w-full min-h-70 bg-gray-200 aspect-w-1 aspect-h-1 rounded-t-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                    {/* Image */}
                </div>
            </div>
            <div class="animate-pulse flex space-x-4 p-3">
              <div class="flex-1 space-y-4 py-1">
                <div class="flex-2 w-full py-2">
                  <div class="h-4 bg-gray-200 rounded w-4/6 float-left"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/6 float-right"></div>
                </div>
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded"></div>
                  <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div class="h-12 bg-gray-200 rounded py-2 mt-2"></div>
                </div>
              </div>
            </div>
        </div>
    )
}
export default ProductLoadAnim;



