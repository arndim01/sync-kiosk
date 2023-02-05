import { ipcMain, dialog } from 'electron';
import Store from 'electron-store';
require('dotenv').config();
var axios = require('axios');
const store = new Store();


const init = (mainWindow) => {
    
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


};

export default {
    init
}