import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AlertDialog = ({ title, content, openWindow, closable, callback }) => {

    const [open, setOpen] = React.useState(false);


    console.log(openWindow);

    React.useEffect( () => { 

        if( openWindow ) setOpen(true)
        else setOpen(false)

    }, [openWindow]);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
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
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={() =>{
                        if( callback != null){
                            callback();
                        }
                        handleClose(); 
                    
                    }
                    } autoFocus>Agree</Button>
                </>    
              }
              
            </DialogActions>
          </Dialog>
        </div>
    );
};

export default AlertDialog;