import styles from './TransactionForm.module.css';
import Grid  from '@mui/material/Grid';
import Wrapper from '../../components/Wrapper';
import React from 'react';
import InsertMoneyDialog from '../../components/DialogBox/InsertMoneyDialog';
import electron from 'electron';
import AlertDialog from '../../components/DialogBox/AlertDialog';

const ipcRenderer = electron.ipcRenderer || false;

const myValues = [
    {display: "1", value: "1", nextline: false},
    {display: "2", value: "2", nextline: false},
    {display: "3", value: "3", nextline: false},
    {display: "4", value: "4", nextline: true},
    {display: "5", value: "5", nextline: false},
    {display: "6", value: "6", nextline: false},
    {display: "7", value: "7", nextline: true},
    {display: "8", value: "8", nextline: false},
    {display: "9", value: "9", nextline: false},
    {display: "ce", value: "ce", nextline: true},
    {display: "0", value: "0", nextline: false},
    {display: "clr", value: "clr", nextline: false}
];

const TransactionForm = () => {
    const [numdisplay, setNumdisplay] = React.useState("09");
    const [error, setError] = React.useState(false);
    const [initialTransaction, setInitialTransaction] = React.useState(null);
    const [alert, setAlert] = React.useState(false);

    const handleNumValue = (value) =>{ 
        setError(false);
        let currentValue = numdisplay;
        
        if( value.value === 'clr' ){
            if( currentValue.length > 2){
                currentValue = currentValue.slice(0, -1);
            }
        }else if(value.value === 'ce'){
            setNumdisplay("09");
            return;
        }else{
            if( currentValue.length === 11) return;
            currentValue += value.value;
        }
        setNumdisplay(currentValue);
    };

    const handlePopupAlertOpen = () => {
        if( numdisplay.length === 11 ){
            setAlert(true);
        }else{
            setError(true);
        }
    }
    const handlePopupAlertClose = () => {
        setAlert(false);
    };

    const handleProc = () =>{
        setAlert(false);
        if( numdisplay.length !== 11 ){
            setError(true);
            return;
        }
        
        ipcRenderer.send('createTransaction', numdisplay);
        setInitialTransaction({
            gcashAccount: numdisplay,
            openDialog: true
        });
    }
    return(
        <>
            <Wrapper>
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                        <div className={styles.container}>
                                <div>
                                    <p id="numdisplay" className={styles.numdisplay}>{ numdisplay }</p>
                                </div>

                                <ul className={styles.keyboard}>
                                    {myValues.map( 
                                    (value, i) =>
                                        {

                                            if(  value.nextline ){
                                                return (<li className={styles.numpad + ' ' + styles.letter  + ' ' + styles.clearl} onClick={ () => handleNumValue(value) } key={i} >{value.display}</li>)
                                            }else{
                                                return (<li className={styles.numpad + ' ' + styles.letter} onClick={ () => handleNumValue(value) } key={i} >{value.display}</li>)
                                            }

                                          
                                        } 
                                    )}
                                    <li className={styles.space + ' ' + styles.clearl} onClick={handlePopupAlertOpen} >Proceed</li>
                                </ul>
                                {
                                    error &&
                                    (
                                        <div className={styles.error}>
                                            Invalid GCash Number
                                        </div>
                                    )   
                                }
                        </div>
                    </Grid>
                    <Grid item xs={7}>
                        <div className={styles.datainfo}>
                            <p>Please enter the gcash account number 09XX XXXX XXX</p>
                            <p>Ex. 09212133222</p>
                            <p>Then click Proceed to insert the amount to cash in.</p>
                        </div>
                        
                    </Grid>
                    <AlertDialog title={`${numdisplay}`} content="Are you sure this is the correct account number?" openWindow={alert} closable={true} callback={handleProc} handleClose={handlePopupAlertClose}/>
                    <InsertMoneyDialog initialTransaction={initialTransaction} />
                </Grid>
                
            </Wrapper>  
        </>
    );
}

export default TransactionForm;