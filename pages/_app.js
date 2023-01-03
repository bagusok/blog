import '../styles/globals.css';
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextNProgress height={1} color={'#fb923c'} options={{ showSpinner: false, easing: 'ease', speed: 500 }} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
