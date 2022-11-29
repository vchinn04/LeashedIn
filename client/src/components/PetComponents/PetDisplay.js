import * as React from "react"
import "./PetDisplay.css"
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import CreatePet from "./CreatePet"

import { useState, useEffect } from 'react';

const EditButton = (props) =>
{
  if (!(props.isEditing)) return(
    <IconButton sx={{ position: 'absolute', mb: 0, ml: '1%', mt: '1%' }} centerRipple={false} size="large" aria-label="edit profile" onClick={() => {props.setEdit(true)}}>
      <EditIcon />
    </IconButton>
  )
}

const PetDisplay = (props) =>
{
  const [isEditing, setEdit] = useState(false);

  return (
    <>
    {(isEditing) ? <CreatePet isUpdating={isEditing} petObj={props.petInfo}  handlePetUpdate={props.handlePetUpdate}  setCurrentPet={props.setCurrentPet} /> :
       <div className="pet-display-frame">
      <div className="pet-info-frame">
        {(props.canEdit) && <EditButton isEditing={isEditing} setEdit={setEdit}/>}

        <IconButton className="pet-frame-close" centerRipple={false} color="primary" aria-label="profile" size="xlarge" onClick={() => {props.setCurrentPet(null)}}>
           <ClearIcon  sx={{color: "#C5C5C5", width:45, height:45}} />
        </IconButton>

        <Avatar
          src={props.petInfo.DisplayImage}
          sx={{mx: 'auto', mt: -5, pt: 0, width: 175, height: 175, border: '5px solid #825DD7'}}
        />

        <h1 className="username">{props.petInfo.PetName}</h1>
        <h2 className="subname">{props.petInfo.PetType}</h2>

        <Box sx={{  height: '50%',mb: 0, width: 0.85, mx: 'auto', backgroundColor: "#FAFBFC",textAlign:"center", borderRadius: '15px' }}>

        <h1 className="section-title" >About Me</h1>

          <Divider variant="middle" sx={{mt:0, m: 1, mb: 2 }}/>
           <TextField sx={{ width: 0.95, height: '90%'}}
              id="outlined-multiline-static"
              maxRows={13}
              minRows={13}
              disabled = {true}
              inputProps={{ maxLength: 1700 }}
              value={props.petInfo.PetDescription}
              inputProps={{
                  style: { color: 'rgb(0,0,0)' }
              }}
              multiline
            />
        </Box>
        {(props.canEdit) && <Box sx={{mt:2 ,textAlign:"center", height: '25',mb: 0, width: 0.85, mx: 'auto'}}>
          <Button className="delete-pet-button" variant="contained" size="large" color="error" onClick={() => {props.deletePet(props.petInfo)}} endIcon={<DeleteIcon  sx={{mt:0, width:25, height:25}} />}>
            Delete
          </Button>

        </Box>
      }
      </div>
    </div>
  }
    </>
  )
}

export default PetDisplay
