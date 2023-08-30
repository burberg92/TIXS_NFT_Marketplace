import Script from 'next/script';
import { ThemeProvider } from 'next-themes';

import { NFTProvider } from '../context/NFTcontext';
import '../styles/globals.css';
import { Footer, Navbar } from '../components';

const App = ({ Component, pageProps }) => (
  <NFTProvider>
    <ThemeProvider attribute="class">
      <div className="dark:bg-nft-dark bg-white min-h-screen">
        <Navbar />
        <div className="pt-65">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>

      <Script src="https://kit.fontawesome.com/b8edc7da24.js" crossOrigin="anonymous" />
    </ThemeProvider>
  </NFTProvider>
);
export default App;
