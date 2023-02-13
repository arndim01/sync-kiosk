import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Image from 'next/image';
import Button from '@mui/material/Button';
import { Grid, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const Sendmoneylist = () => {
    const router = useRouter();
    const RedirectSendMoney = () => {
        router.replace('/sendmoney');
    }
    
    return(
        <>
            <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                m: 1,
                width: 250,
                height: 200,
                },
            }}
            >
                <Button variant="outlined" href='/transactionform.html' >
                    <Grid container spacing={0}>
                        <Grid paddingTop={2} item xs={12} textAlign="center">
                                
                            <Image 
                                    src="/images/GCash_Logo-700x618.png"
                                    width={120}
                                    height={120}
                                    />
                        </Grid>    
                        <Grid item xs={12}>    
                            <Typography
                                variant="h6"
                                component="div"
                                textAlign="center"
                            >
                                Send Express
                            </Typography>
                        </Grid>
                    </Grid>
                </Button>
            </Box>
        </>
    );
};

export default Sendmoneylist;