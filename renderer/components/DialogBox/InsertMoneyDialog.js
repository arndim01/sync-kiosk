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

const ipcRenderer = electron.ipcRenderer || false;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const InsertMoneyDialog = ({initialTransaction}) => {

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isProceed, setIsProceed] = React.useState(false);
    const [data, setData] = React.useState(null);
    const [inserted, setInserted] = React.useState(false);

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
                setData(data.data);
            }else{
                setOpen(false);
            }

        });

        return () => {
            ipcRenderer.removeAllListeners('handleTransaction');
        }
      }, []);

    React.useEffect( () => {
        ipcRenderer.on('handleProceed', (event, data) => {
            setLoading(false);
            if( data.ok ){
                setData(data.data);
            }else{
                setOpen(false);
            }

        });

        return () => {
            ipcRenderer.removeAllListeners('handleTransaction');
        }
      }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return(
        <>
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
                    <Button color="inherit" sx={{ visibility: isProceed ? 'visible': 'hidden' }}>
                        Proceed
                    </Button>
                </Toolbar>
                </AppBar>
                <Wrapper>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>


                            {
                                data && !loading &&
                                <div>
                                    <p><strong>Reference No.: </strong> { data ? data.referenceNumber: "" }</p>
                                    <p><strong>GCash Account: </strong> { initialTransaction? initialTransaction.gcashAccount: "" } </p>
                                    <p><strong>Amount: </strong> 0 PHP</p>
                                    <p><strong>Conv. Fee: </strong> 10 PHP</p>
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