import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Headbar from '../components/Headbar';
import Sendmoneylist from '../page-components/SendMoney/Sendmoneylist';

function SendMoneyPage() {

  const props ={
    main: false,
    previous_page: "/home",
    page_title: "Send Money"
  };


  return (
    <>
      <Head>
        <title> Sync Kiosk - Send Money </title>
      </Head>
      <Headbar props={props}/>
      <Sendmoneylist />
    </>
  );
};

export default SendMoneyPage;
