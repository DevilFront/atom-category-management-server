import '@/styles/globals.css'
import 'antd/dist/antd.css';
import {RecoilRoot} from "recoil";

export default function App({ Component, pageProps }) {
  return (
      <RecoilRoot>
      <Component {...pageProps} />
      </RecoilRoot>
  )
}
