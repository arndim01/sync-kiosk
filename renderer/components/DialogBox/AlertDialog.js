import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AlertDialog = ({ title, content, openWindow, closable, callback, handleClose }) => {

    const [open, setOpen] = React.useState(false);
    React.useEffect( () => { 

        if( openWindow ) setOpen(true)
        else setOpen(false)

    }, [openWindow]);
    const close = () => {
        setOpen(false);
    };
    return (
        <>
          <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                { content }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {
                closable &&
                <>
                    <Button onClick={() => {
                      if( handleClose != null){
                        handleClose();
                      }
                      close();
                    }}>No</Button>
                    <Button onClick={() =>{
                      if( callback != null){
                        callback();
                      }
                      close(); 
                    }
                    }>Yes</Button>
                </>    
              }
              
            </DialogActions>
          </Dialog>
        </>
    );
};

export default AlertDialog;