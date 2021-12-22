import React from "react";
import App, { AppContext, AppProps } from "next/app";
import { Provider } from "react-redux";
import configureStore from "../reducers/configureStore";
import "../styles/globals.scss";

import Header from "../src/components/Header";
import UploadModal from "../src/components/UploadModal"


// store 설정파일 로드
const store = configureStore();

const _APP = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Header />
      <div id="__wrap">
        <div id="__container">
          <Component {...pageProps} />
        </div>
        
        {/* 사진 업로드 모달 */}
        <UploadModal />
      </div>
      
    </Provider>
  );
};

_APP.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default _APP;
