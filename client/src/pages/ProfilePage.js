import * as React from "react"
import "./ProfilePage.css"
import { useParams } from 'react-router-dom'
import { useState } from 'react';

import NavBar from "../components/NavBar/NavBar"
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import AddBoxIcon from '@mui/icons-material/AddBox';

const petList = [
  {
    PetName: "Coolio",
    PetId: "randomhash",
    PetPic: './Eduardo.jpeg'
  },

  {
    PetName: "CoolioTwo",
    PetId: "randomhash1",
    PetPic: './Eduardo.jpeg'
  },

  {
    PetName: "CoolioThree",
    PetId: "randomhash2",
    PetPic: './Eduardo.jpeg'
  },

  {
    PetName: "CoolioFour",
    PetId: "randomhash3",
    PetPic: './Eduardo.jpeg'
  },

  {
    PetName: "CoolioFour",
    PetId: "randomhash4",
    PetPic: './Eduardo.jpeg'
  },

  {
    PetName: "CoolioFour",
    PetId: "randomhash5",
    PetPic: './Eduardo.jpeg'
  },


  {
    PetName: "CoolioFour",
    PetId: "randomhash6",
    PetPic: './Eduardo.jpeg'
  },


  {
    PetName: "CoolioFour",
    PetId: "randomhash7",
    PetPic: './Eduardo.jpeg'
  },

  {
    PetName: "CoolioFour",
    PetId: "randomhash8",
    PetPic: './Eduardo.jpeg'
  }
]

const ProfilePage = (props ) =>
{
  let { id } = useParams();
  const [aboutState, setAboutState] = useState("");
  const [isEditing, setEdit] = useState(false);

  console.log(id)
  console.log((aboutState.split('\n')).length)

  return (
      <div className="profile-page-frame">

        <NavBar setLoginState={props.setLoginState} />

        <div className="info-frame">

          <div className="pic-frame">

            <IconButton sx={{ mb: 0, ml: '95%' }} size="large" aria-label="edit profile">
              <EditIcon />
            </IconButton>

            <Avatar
              alt="vchinn"
              src="/Eduardo.jpeg"
              sx={{mx: 'auto', mt: -2, pt: 0, width: 175, height: 175, border: '5px solid #825DD7'}}
            />

            <Divider variant="middle" sx={{ m: 2, mb: -1 }}/>

            <h1 className="username">Victor Chinnappan</h1>
            <h2 className="subname">@vchinn</h2>
          </div>

          <div className="about-me-frame">
            <h1 className="section-title">About Me</h1>

            <Divider variant="middle" sx={{ m: 2, mb: 2 }}/>

            <Box sx={{  height: '75%',mb: 2, width: 0.97, mx: 'auto'}}>
              <TextField sx={{ width: 1, height: '100%', color: '#515151'}}
                 id="outlined-multiline-static"
                 maxRows={13}
                 minRows={13}
                 disabled = {!isEditing}
                 inputProps={{ maxLength: 1700 }}
                 value={aboutState}
                 onChange={(event) => { let aboutStr = event.target.value; let aboutArr = aboutStr.split('\n');
                  if (aboutArr.length > 13){
                     aboutStr = (aboutArr.slice(0,13)).join('\n')
                   }
                   setAboutState(aboutStr)}}

                 multiline
               />
            </Box>
          </div>

          <div className="pet-frame">
            <h1 className="section-title">My Pets</h1>

            <Divider variant="middle" sx={{ m: 2, mb: 2  }}/>

            <Box className="pet-buttons" sx={{ width: 0.9, flexWrap: 'wrap', mx: 'auto'}}>
               <Grid className="grid-contain" container sx={{alignItems: 'center', justifyContent: 'center', mb: 'auto', mx: 'auto'}} spacing={1}>

                     {
                       petList.map((element) => {
                        return (
                           <Grid key={element.PetId} item xs={1.75}>
                               <IconButton className="gridButton" color="primary" aria-label="profile" style={{backgroundColor:'rgba(130, 93, 215, 0'}} >
                                  <Avatar className="grid-avatar" src='/Eduardo.jpeg' alt="Profile" variant="rounded" sx={{  width: 95, height: 95 }} />
                                  <Chip  className="name-chip" size="small"  color="secondary"  style={{backgroundColor:'rgba(130, 93, 215, 0.7'}} label={element.PetName} sx={{ zIndex: 20 }}/>
                               </IconButton>
                           </Grid>
                         );
                     })}

                     <Grid item xs={1.75}>
                         <IconButton  color="primary" aria-label="profile" size="xlarge" >
                            <AddBoxIcon sx={{color: "#825DD7", width:95, height:95}} />
                         </IconButton>
                     </Grid>
                  </Grid>
              </Box>

          </div>
        </div>
      </div>
    );

}

export default ProfilePage;
