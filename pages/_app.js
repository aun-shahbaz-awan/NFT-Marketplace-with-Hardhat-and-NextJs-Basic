import React from 'react'
import Footer from '../components/single-components/Footer'
import Header from '../components/single-components/Header'
import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider appId="Y3Yod9lWu77Xw8y9STtAViGveXbIQphhR6t420Cu" serverUrl="https://zete9krq17np.usemoralis.com:2053/server">
        <React.Fragment>
          <Header/>
          <Component {...pageProps} />
          <Footer/>
        </React.Fragment>
    </MoralisProvider>
  )


}

export default MyApp
