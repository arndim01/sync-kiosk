import Head from 'next/head';
const Layout = ({ children }) => {

    return (
        <>
            <Head>
                <title> Synchronizer Application </title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <main> {children} </main>
        </>
    );

}

export default Layout;