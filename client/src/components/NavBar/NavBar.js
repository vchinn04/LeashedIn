import * as React from "react"
import "./NavBar.css"

import { AuthContext } from '../../context.js';

import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';

import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ErrorIcon from '@mui/icons-material/Error';
import { spacing } from '@mui/system';

import { useState } from 'react'

const SearchListBox = (props) => //List that displays found profile buttons
{
  const userArr = props.userArr;

  return (
    <Box sx={{boxShadow: 2, width: 1, mx: 'auto', mt:1,  maxWidth: 479, bgcolor: '#EEEFF1', borderRadius: '7.5px'}}>
      <List>
          {
            userArr.map( (item, index) => {
              return (
                <>
                  <ListItem  component="div" disablePadding>
                    <ListItemButton
                        disabled={(item._id==-1)? true : false}
                        component={Link} to={`/profile/${item.name}`}
                        sx={{
                           ".Mui-disabled": {
                            bgcolor: "green"
                          }
                          }}>
                            <ListItemIcon>
                              {(item._id!=-1) ? <Avatar src='./Eduardo.jpeg' alt={item.name} /> : <ErrorIcon /> }
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>

                  {(index < (userArr.length-1)) &&  <Divider />}
                </>
              );
            })
          }
      </List>
    </Box>
  );
}

const NavBar = (props) =>
{
  const [searchState, setSearchState] = useState("");
  const [userArrObj, setUserArr] = useState([]);

  const getResponse = async(searchString) => {
    const url = '/getUserArr?' + new URLSearchParams({ searchEntry: searchString }).toString() //Fire get event to find users with search string in their usernames
    const response = await fetch(url);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  }

   function handleInputChange(event) { //Fires everytime search textfield changes
        const target = event.target;

        if (target.value.length >= 3) //If user enters 3 or more letters, then fire the get event
        {
            getResponse(target.value)
              .then(res => {
                const someData = res;
                let userArray = JSON.parse(res.userList)

                if (userArray.length == 0) //If no users found then push a "fake" user to display that no users found
                {
                  userArray.push(
                    {
                      _id: -1, //assign _id to -1 in order for the button to be disabled
                      name: "Oops...no results found!"
                    }
                  )
                }

                setUserArr(userArray)
              })
        }
        else //if less than 3 input chars, simply set state to empty array
        {
          setUserArr([])
        }

        setSearchState(target.value); //Update the Search State to make sure value in text field is up to date
  }
  return (
    <div className="navbar-frame">

      <IconButton color="primary" aria-label="upload picture" component={Link} to="/">
        <Avatar src='./Logo.png' alt="Home" variant="rounded"/>
      </IconButton>

      <div className="search-frame">

          <TextField id="outlined-password-input"
            label="Search..."
            name="search"
            variant="outlined"
            size="small"
            value={searchState}
            onChange={handleInputChange}

            sx={{
              mt: 0.85,
              width: 1 ,
               [`& fieldset`]: {
                 borderRadius: '30px',
               }}}

             InputProps={{
                endAdornment: (
                   <InputAdornment position="end">
                       <SearchIcon />
                   </InputAdornment>
               )
             }}
             />

             {
               (userArrObj.length > 0) && <SearchListBox userArr={userArrObj} />
             }
        </div>

        <IconButton color="primary" aria-label="profile"  component={Link} to="/profile">
          <Avatar src='./Eduardo.jpeg' alt="Profile" />
        </IconButton>

        <IconButton aria-label="logout" onClick={() => props.setLoginState(false)} component={Link} to="/">
          <LogoutIcon />
        </IconButton>
    </div>
  );
}

export default NavBar;
