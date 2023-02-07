import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Help  from '@mui/icons-material/Help';
import Button from '@mui/material/Button';
import MaintenanceAlert from './MaintenanceAlert';

function Headbar({props}) {

  return (
    <Box sx={{ flexGrow: 1}}>
      <CssBaseline />
      <MaintenanceAlert />
      <AppBar component="nav" position="static">
        <Toolbar>
          
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, visibility: props.main? "hidden": "visible", position:"fixed"  }}
            href={props.previous_page}
          >
            <ArrowBackIos /> 
          </IconButton>
          
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlign: 'center' }}
          >
           {props.page_title}
          </Typography>
          <IconButton
              size="large"
              edge="end"
              aria-haspopup="true"
              color="inherit"
            >
              <Help />
            </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Headbar;