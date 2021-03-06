import React from "react";
import App, {AppContext, AppProps} from "next/app";
import {Provider} from "react-redux";
import {useRouter} from "next/router";
import {useState, useEffect} from "react";
import configureStore from "../reducers/configureStore";
import "../styles/globals.scss";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./theme";

import AppLayout from "../src/layout/AppLayout";
import ManageLayout from "../src/layout/ManageLayout";

import {Button} from "@mui/material";

// store 설정파일 로드
const store = configureStore();

const _APP = ({Component, pageProps}: AppProps) => {
  const router = useRouter();

  function setLayout() {
    if (router.pathname.indexOf("manage") >= 0) {
      return (
        <ManageLayout>
          <Component style={{width: "100%", height: "100%"}} {...pageProps} />
        </ManageLayout>
      );
    } else {
      return (
        <AppLayout>
          <Component style={{width: "100%", height: "100%"}} {...pageProps} />
        </AppLayout>
      );
    }
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {setLayout()}
      </ThemeProvider>
    </Provider>
  );
};

_APP.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {...appProps};
};

export default _APP;
