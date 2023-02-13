import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Wrapper from '../../components/Wrapper';
import Grid  from '@mui/material/Grid';
import React from 'react';
import electron from 'electron';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';
const ipcRenderer = electron.ipcRenderer || false;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const InsertMoneyDialog = ({initialTransaction}) => {

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isProceed, setIsProceed] = React.useState(false);
    const [openReceipt, setOpenReceipt] = React.useState(false);
    const [receipt, setReceipt] = React.useState(null);
    const [inserted, setInserted] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const [reference, setReference] = React.useState("");
    const router = useRouter();

    React.useEffect( () => {

        if( initialTransaction ){
            setOpen(initialTransaction.openDialog);
            setLoading(true);
        }

    }, [initialTransaction]);

    React.useEffect( () => {
        ipcRenderer.on('handleTransaction', (event, data) => {
            setLoading(false);
            if( data.ok ){
                setReference(data.data.referenceNumber);
                ipcRenderer.send('open-coin');
            }else{
                setOpen(false);
            }
        });

        return () => {
            ipcRenderer.removeAllListeners('handleTransaction');
        }
      }, []);

    React.useEffect( () => {
        ipcRenderer.on('handleCoinData', (event, data) => {
            ipcRenderer.send('update-logs', { amount: parseInt(data.data)});
            setCount(count => count + parseInt(data.data));
            setIsProceed(true);
            setInserted(true);
        });
        return () => {
            ipcRenderer.removeAllListeners('handleCoinData');
        }
    }, []);

    const handleClose = () => {
        ipcRenderer.send('close-coin');
        setOpen(false);
        setCount(0);
        setIsProceed(false);
        setInserted(false);
        setOpenReceipt(false);
        setReceipt(null);
        setReference("");
    };

    const sendFinalRequest = () =>{
        let {reference, totalCashIn, fee } = ipcRenderer.sendSync('calculate');
        ipcRenderer.send('sendRequest', { reference, totalCashIn, fee });
        ipcRenderer.send('close-coin');
        router.push('/sendmoney');
    };

    const handleOpenReceipt = () => {
        let {reference, totalCashIn, fee } = ipcRenderer.sendSync('calculate');
        let rcalculate = {
            referenceNumber: reference,
            amount: totalCashIn,
            fee: fee   
        }
        setReceipt(rcalculate);
        setOpenReceipt(true);
    }

    const hadleCloseReceipt = () =>{
        setOpenReceipt(false);
    }

    return(
        <>
            {/* <AlertDialog
                openWindow={openReceipt} 
                title="Cash In"
                callback={sendFinalRequest}
                handleClose={handleClose}
                content={<ReceiptContent props={receipt} />}
            /> */}

            <Dialog
                open={openReceipt}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Review - Cash In 
                </DialogTitle>
                <DialogContent>
                        {
                            receipt &&
                            <>
                                <div><strong>Reference Number: {receipt.referenceNumber}</strong></div>
                                <div><strong>Cash In Amount: {receipt.amount} PHP</strong></div>
                                <div><strong>Fee: {receipt.fee} PHP</strong></div>
                            </>
                        }
                </DialogContent>
                <DialogActions>
                        <Button onClick={hadleCloseReceipt}>No</Button>
                        <Button onClick={sendFinalRequest}>Yes</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    sx={{ visibility: inserted? "hidden": "visible" }}
                    >
                    <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Insert Bills Or Coins
                    </Typography>
                    <Button onClick={handleOpenReceipt} color="inherit" sx={{ visibility: isProceed ? 'visible': 'hidden' }}>
                        Proceed
                    </Button>
                </Toolbar>
                </AppBar>
                <Wrapper>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            {
                                reference && !loading &&
                                <div>
                                    <p><strong>Reference No.: </strong> { reference ? reference: "" }</p>
                                    <p><strong>GCash Account: </strong> { initialTransaction? initialTransaction.gcashAccount: "" } </p>
                                    <p><strong>Inserted Amount: </strong> { count } PHP</p>
                                </div>
                            }
                        </Grid>
                    </Grid>
                </Wrapper>
            </Dialog>
        </>
    );
}

export default InsertMoneyDialog;