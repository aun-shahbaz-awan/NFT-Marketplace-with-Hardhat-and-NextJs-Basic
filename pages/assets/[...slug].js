import { useRouter } from 'next/dist/client/router'
import React from 'react'
import ProductDetail from '../../components/single-components/ProductDetail'

export default function Asset() {
    const router = useRouter()
    const {slug} = router.query
    return (
        <React.Fragment>
            <ProductDetail slug={slug}/>
        </React.Fragment>
    )
}
