import { ipcMain, dialog } from 'electron';
import Store from 'electron-store';
require('dotenv').config();
var axios = require('axios');
const store = new Store();


const init = (mainWindow) => {

    ipcMain.on('getConfig', (event, arg) => {
        event.returnValue = {
            API_HEARTBEAT_URL: process.env.API_QUEUE_URL,
            TOKEN: process.env.TOKEN,
            ACC: process.env.ACC,
            PWD: process.env.PWD,
            IsProd: process.env.NODE_ENV === 'production',
        };
    });
    
    ipcMain.on('createTransaction', (event, arg) => {
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key' : process.env.TOKEN
        }
        const data = {
            acc: process.env.ACC,
            password: process.env.PWD,
            number: arg,
            type: "gcash",
            name: "",
            amount: 0,
            currency: "PHP",
            attempt: "queue"
        };
          
        axios.post(process.env.API_TRANSACTION_URL, data, {
            headers: headers
        })
        .then((response) => {
            console.log(response);
            if( response.status == 201){
                console.log("event successful");

                mainWindow.webContents.send('handleTransaction', {
                    data: response.data,
                    ok: response.status === 201
                });
            }else{
                mainWindow.webContents.send('handleTransaction', {
                    data: null,
                    ok: false
                });
            }
        })
        .catch((error) => {
            console.log(error);
            mainWindow.webContents.send('handleTransaction', {
                data: null,
                ok: false
            });
        })
    });

    ipcMain.on('getHeartbeat', (event, arg) => {
        const headers = {
            'x-api-key': process.env.TOKEN
        }
        axios.get(process.env.API_HEARTBEAT_URL + '?machine=no', {
            headers: headers
        }).then((response) => {
            if( response.status == 200){
                mainWindow.webContents.send('heartbeat', {
                    data: response.data,
                    ok: response.status === 200
                });
            }else{
                mainWindow.webContents.send('heartbeat', {
                    data: null,
                    ok: false
                });
            }
        })
        .catch((error) => {
            mainWindow.webContents.send('heartbeat', {
                data: null,
                ok: false
            });
        })
    });

};

export default {
    init
}