import { ipcMain } from 'electron';
const { SerialPort } = require('serialport');
import Store from 'electron-store';
const store = new Store();
import coinListener from './coinListener';

const init = (mainWindow) => {
    
    SerialPort.list().then(function (ports){
        ports.forEach(function(port){
            if( port.serialNumber === '558383430343514181F2' ){
                console.log('found port: ', port);
                store.set('coin_port', port);
                store.set('coin_port_config', {
                    path: port.path,
                    baudRate: 9600,
                    dataBits: 8,
                    parity: 'none',
                    stopBits: 1,
                }); 
                coinListener.init(mainWindow, port);
            }
        });

        // if( store.get('coin_port') === 'undefined' ){
        //     console.log('failed port coin');
        //     mainWindow.webContents.send('handleCoinAcceptorError', {
        //         type: 'port error',
        //         message: 'coin port missing'
        //     }); 
        // }
    });

};

export default {
    init
}

