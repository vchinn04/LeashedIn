import * as React from "react"
import "./FollowDisplay.css"
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import Slide from '@mui/material/Slide';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ErrorIcon from '@mui/icons-material/Error';
import { Link } from "react-router-dom";
import Chip from '@mui/material/Chip';

import { useState, useEffect } from 'react';

const ListBox = (props) => {
  return (
    <Box sx={{overflow:'scroll', width: 0.85, height: 0.85, mx: "auto", mt:'-15px', bgcolor: '#F8F8F8', borderRadius: '7.5px'}}>
      <List>
          {
            props.userArr.map( (item, index) => {
              return (
                <>
                  <ListItem  component="div" disablePadding>
                    <ListItemButton
                        component={Link} to={`/profile/${item}`}
                        onClick={() => {props.setListDisplay(false)}}
                        key={item}
                        sx={{
                           ".Mui-disabled": {
                            bgcolor: "green"
                          }
                          }}>
                            <ListItemIcon>
                              <Avatar src={props.userImages[item]} alt={null}/>
                            </ListItemIcon>

                            {(props.canEdit && props.isFollowing) && <Chip label="Unfollow" color="error"  size="medium" sx={{position: 'relative', top:'0%', mb: 1, left: '75%' ,fontWeight: 'bold' }} onClick={(e) => {e.preventDefault(); props.handleFollowers(item)}} />}

                            <ListItemText primary={item} />
                    </ListItemButton>
                  </ListItem>

                  {(index < (props.userArr.length-1)) &&  <Divider />}
                </>
              );
            })
          }
      </List>
    </Box>
  );
}
const FollowDisplay = (props) =>
{
  const [userImages, setUserImages] = useState({});
  const [reRender, setreRender] = useState(false);

  const getResponse = async(searchString) => {
    var promiseArr = []
    var userImagesT = {}
    var completedArr = 0
    for (let i of props.userArr)
    {
      if (userImagesT[i] == undefined)
      {

        const getPfpURL = '/getUserProfilePic?' + new URLSearchParams({ username: i }).toString()

        promiseArr.push(fetch(getPfpURL)
                        .then(async (result) =>
                        {
                           let myBlob = await result.blob()

                           var reader  = new FileReader();

                           reader.onload = function(e)  {
                             completedArr += 1
                              userImagesT[i] = e.target.result
                              if (completedArr == props.userArr.length)
                               {
                                  setUserImages({})
                                  setreRender(false)
                                  setUserImages(userImagesT)
                                  setreRender(true)};
                              }

                           reader.readAsDataURL(myBlob);
                         })
                         .catch((error) => {
                           console.error('Error:', error);
                         })
                       )
       }
    }

    await Promise.all(promiseArr)
    setreRender(false)
    setUserImages(userImages)
    setreRender(true)
  }

  useEffect(() => {
    getResponse()
  }, []);
  return (
    <>
      <div className="main-display-frame">
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
          <div className="display-frame">
              <IconButton className="petwork-frame-close" centerRipple={false} sx={{position:"sticky", mb: 0, ml: '0.75%', mt: '0.1%' }} color="primary" aria-label="profile" size="xlarge" onClick={() => {props.setListDisplay(false)}}>
                 <ClearIcon  sx={{color: "#C5C5C5", width:45, height:45}} />
              </IconButton>

              <h1 className="petwork-text">{props.userId}'s Petwork</h1>

             <ListBox userArr={props.userArr} setListDisplay={props.setListDisplay} userImages={userImages} canEdit={props.canEdit} isFollowing={props.isFollowing} handleFollowers={props.handleFollowers}/>
          </div>
        </Slide>
      </div>
    </>
  )
}

export default FollowDisplay
