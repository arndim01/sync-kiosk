import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Headbar from '../components/Headbar';
import HomeLayout from '../page-components/Home/HomeLayout';

const ipcRenderer = electron.ipcRenderer || false;

function HomePage() {

  const props ={
    main: true,
    previous_page: null,
    page_title: "Sync Kiosk"
  };

  return (
    <>
      <Head>
        <title> Sync Kiosk </title>
      </Head>
      <Headbar props={props}/>
      <HomeLayout />
    </>
  );
};

export default HomePage;
