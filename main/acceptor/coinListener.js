import { ipcMain } from 'electron';
import Store from 'electron-store';
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const parser = new ReadlineParser();
require('dotenv').config();
var axios = require('axios');
const store = new Store();


const init = (mainWindow, port) => {

    const sport = new SerialPort({
        path: port.path,
        baudRate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
    });
    sport.pipe(parser);

    sport.on("open", () => {
        console.log('serial port open');
    });    

    sport.on('error', function(err){
        console.log(err);
    });

    parser.on('data', data =>{
        console.log(data);
        let rp = data.replace('\r', '');
        store.set('rAmount', store.get('rAmount') + parseInt(rp));
        mainWindow.webContents.send('handleCoinData', {
            data: rp,
            ok: false
        });
    });

    ipcMain.on('open-coin', (event, arg) => {
        sport.write('c\n');        
    });

    ipcMain.on('close-coin', (event, arg) => {
        sport.write('r\n');
    });

    ipcMain.on('update-logs', (event, arg) => {
        const { amount } = arg;
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key' : process.env.TOKEN
        }
        const data = {
            acc: process.env.ACC,
            password: process.env.PWD,
            referenceNumber: store.get('rNumber'),
            amount: amount,
            currency: "PHP",
            type: "COIN"
        };
        axios.post(process.env.API_TRANSACTION_LOG_URL, data, {
            headers: headers
        })
        .then((response) => {
            console.log(process.env.API_TRANSACTION_LOG_URL + ": " + response.status);
            if( response.status == 201){
            }
        })
        .catch((error) => {
            console.log(error);
        })
    });

    ipcMain.on('sendRequest', (event, arg) => {
        const {reference, totalCashIn, fee} = arg;

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key' : process.env.TOKEN
        };

        const data = {
            acc: process.env.ACC,
            password: process.env.PWD,
            referenceNumber: reference,
            cashIn: totalCashIn,
            fee: fee
        };

        axios.post(process.env.API_TRANSACTION_UPDATE_URL, data, {
            headers: headers
        })
        .then((response) => {
            console.log(process.env.API_TRANSACTION_UPDATE_URL + ": " + response.status);
            if( response.status == 200){
            }
        })
        .catch((error) => {
            console.log(error);
        })

        

    });

    ipcMain.on('calculate', (event, arg) => {

        let rNumber = store.get('rNumber');
        let rAmount = store.get('rAmount');


        console.log("R amount: ", rAmount);

        let fee = 0;

        if( rAmount >= 25 && rAmount <= 200 ){
            fee = 5;
        }else if(rAmount > 200 && rAmount <= 500 ){
            fee = 10;
        }else if(rAmount > 500 && rAmount < 1000){
            fee = 15;
        }else if(rAmount >= 1000 && rAmount < 2000){
            fee = 20;
        }else if(rAmount >= 2000 && rAmount < 3000){
            fee = 40;
        }else if(rAmount >= 3000 && rAmount < 4000){
            fee = 60;
        }else if(rAmount >= 4000 && rAmount < 5000){
            fee = 80;
        }else if(rAmount >= 5000 && rAmount < 6000){
            fee = 100;
        }else if(rAmount >= 6000 && rAmount < 7000){
            fee = 120;
        }else if(rAmount >= 7000 && rAmount < 8000){
            fee = 140;
        }else if(rAmount >= 8000 && rAmount < 9000){
            fee = 160;
        }else if(rAmount >= 9000 && rAmount < 10000){
            fee = 180;
        }else if(rAmount >= 10000){
            fee = 200;
        }else{
            fee = 2;
        }
        let totalCashIn = rAmount - fee;
        console.log("fee: ", fee)
        console.log("cashin: ", totalCashIn);
        event.returnValue = { reference: rNumber, totalCashIn, fee };
    });
};

export default {
    init
}