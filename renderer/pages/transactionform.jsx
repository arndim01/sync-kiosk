import Head from "next/head";
import Headbar from "../components/Headbar";
import TransactionForm from "../page-components/Transaction/TransactionForm";

function TransactionFormPage(){

    const props ={
        main: false,
        previous_page: "/sendmoney.html",
        page_title: "Transfer Money"
    };

    return(
        <>
            <Head>
                <title> Transfer Money </title>
            </Head>
            <Headbar props={props}/>
            <TransactionForm />
        </>
    );
}

export default TransactionFormPage;