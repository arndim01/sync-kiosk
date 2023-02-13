import AlertDialog from '../components/DialogBox/AlertDialog';
import { useRouter } from 'next/router';
import electron from 'electron';
import React from 'react';
const ipcRenderer = electron.ipcRenderer || false;


const MaintenanceAlert = () => {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    
    React.useEffect(() => {
        let interval = setInterval( () => {
            ipcRenderer.send('getHeartbeat');
        }, 10000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    React.useEffect( () => {
        ipcRenderer.on('heartbeat', (event, data) => {
          if( data.ok && data.data ) setOpen(!data.data.status);
          else setOpen(true);
        });
        return () => {
          ipcRenderer.removeAllListeners('heartbeat');
        }
    }, []);

    React.useEffect( () => {
        if( open ){
            ipcRenderer.send('close-coin');
            router.push('/home');
        }
    }, [open]);

    return(
        <>
            <AlertDialog 
					title={"System Maintenance"} 
					content={"Something has gone wrong on our end. We apologize for the incovenience."}
					openWindow={open}
					closable={false} />
        </>
    )
};

export default MaintenanceAlert;
