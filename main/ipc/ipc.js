import { ipcMain, dialog } from 'electron';
import Store from 'electron-store';
require('dotenv').config();
var axios = require('axios');
const store = new Store();

//I need check for serial-port if-open and display popup alert

const init = (mainWindow) => {
    ipcMain.on('createTransaction', (event, arg) => {
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key' : process.env.TOKEN
        }
        const data = {
            acc: process.env.ACC,
            password: process.env.ACCPWD,
            number: arg,
            type: "gcash",
            name: "",
            amount: 0,
            currency: "PHP",
            attempt: "pending"
        };
          
        axios.post(process.env.API_TRANSACTION_URL, data, {
            headers: headers
        })
        .then((response) => {
            console.log(process.env.API_TRANSACTION_URL + ": " + response.status);
            console.log(response);
            mainWindow.webContents.send('debug-result', {
                status: response.status,
                data: response.data,
                url: process.env.API_TRANSACTION_URL
            });
            if( response.status == 201){
                store.set('rNumber', response.data.referenceNumber);
                store.set('rAmount', 0);
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
            //Handler Error Notification
            mainWindow.webContents.send('debug-result', {
                status: error.response.status,
                data: error.response.data,
                url: process.env.API_TRANSACTION_URL
            });
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

            //Handler Error Notification

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