import * as React from "react"
import "./CreatePet.css"
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Select from "react-select";
import Slide from '@mui/material/Slide';
import { useState, useEffect } from 'react';


const  options= [
                {value: 'amphibian', label: 'Amphibian'},
                {value: 'cat', label: 'Cat'},
                {value: 'dog', label: 'Dog'},
                {value: 'bird', label: 'Bird'},
                {value: 'ferret', label: 'Ferret'},
                {value: 'fish', label: 'Fish'},
                {value: 'guineaPig', label: 'Guinea Pig'},
                {value: 'horse', label: 'Horse'},
                {value: 'insect', label: 'Insect'},
                {value: 'lizard', label: 'Lizard'},
                {value: 'rabbit', label: 'Rabbit'},
                {value: 'turtle', label: 'Turtle'}
            ]

const CreatePet = (props) =>
{
  const isEditing = props.petInfo == "add"
  const [petsArray, setPetArray] = useState({value: ((props.petObj) ? props.petObj.PetType.toLowerCase() : "dog"), label: ((props.petObj) ? props.petObj.PetType : "Dog")})
  const [petNameValue, setPetName] = useState(((props.petObj) ? props.petObj.PetName : ""))
  const [petDescriptionValue, setPetDescription] = useState(((props.petObj) ? props.petObj.PetDescription : ""))
  const [inputImage, setImage] = useState(((props.petObj) ? props.petObj.DisplayImage : ""));
  const [inputImagePath, setImagePath] = useState(null);
  const [inputImageFile, setImageFile] = useState(null);
  const [fileRemoved, setfileRemoved] = useState(false);

  const multiPetSelectHandleOnChange = (a) => // handle select input
  {
    setPetArray(a)
  }

  const setUpFile = (file) => // sets up the passed in file
  {
    var reader  = new FileReader();
    reader.onload = function(e)  {
       setImage(e.target.result)
    }
    setImageFile(file)
    reader.readAsDataURL(file);
  }

  const handleFile = (event) => // in charge of handling a file when its uploaded
  {
    if (!event.target.files[0])
      return

    setImagePath(event.target.value)
    setfileRemoved(false)
    setUpFile(event.target.files[0])
  }

  const removeFile = (event) => // in charge of removing image
  {
    setImagePath("")
    setImage(null)
    setImageFile(null)
    setfileRemoved(true)
   }

  const handleCreate = () => { // pass the updated info to the needed function
    const petInformation = {
      PetId: ((props.petObj) ? props.petObj.PetId : null),
      DisplayImage: inputImage,
      PetImage: ((inputImageFile) ? inputImageFile.name : ""),
      PetType: petsArray.label,
      PetName: petNameValue,
      PetDescription: petDescriptionValue,
      fileRemoved: fileRemoved
    }

    if (props.isUpdating)
      props.handlePetUpdate(petInformation, inputImageFile) // call the update function
    else
      props.handlePetAdd(petInformation, inputImageFile) // call the create function
  }

  return (
    <div className="pet-display-frame">
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <div className="slide-container">
          <div className="pet-info-frame">
            <h2 className="create-pet-frame-title">{(props.isUpdating) ? "Edit" : "Create"} Pet.....</h2>

            <IconButton className="pet-frame-close" centerRipple={false} color="primary" aria-label="profile" size="xlarge" onClick={() => {props.setCurrentPet(null)}}>
              <ClearIcon  sx={{color: "#C5C5C5", width:45, height:45}} />
            </IconButton>

            <Avatar
              src={inputImage}
              sx={{mx: 'auto', mt: -5, pt: 0, width: 175, height: 175, border: '5px solid #825DD7'}}
            />


            <Button variant="contained" component="label" color="primary"  size="small" sx={{position: 'absolute', top: '10.5%', mb:0, left: '63%' ,fontWeight: 'bold' }}>
              Upload
              <input hidden accept="image/*" type="file" onChange={handleFile}/>
            </Button>

            <Button variant="contained" component="label" color="error"  size="small" sx={{position: 'absolute', top: '15.5%', mb:0, left: '63%' ,fontWeight: 'bold' }} onClick={removeFile}>
              Remove
            </Button>

            <h3 className="path-text">{inputImagePath}</h3>

            <Divider variant="middle" sx={{ m: 3, mb: -1 }}/>

            <TextField hiddenLabel size="medium" id="standard-basic" helperText="Pet Name" value={petNameValue} variant="standard" sx={{mt: 2, mb: 3, ml: '30%', textAlign: 'center', width: 300}}
              inputProps={{style: {fontSize: 32, color: '#825DD7', textAlign: 'center',fontFamily: 'Verdana', fontWeight: "bold"}}} onChange={(event) => {setPetName(event.target.value)}}
            />

            <Select className="form-select" onChange={multiPetSelectHandleOnChange}
              value={petsArray} options={options}/>


            <Box sx={{  height: '50%',mb: 0, width: 0.85, mx: 'auto', backgroundColor: "#FAFBFC",textAlign:"center", borderRadius: '15px' }}>
              <h1 className="section-title" >About Me</h1>
              <Divider variant="middle" sx={{mt:0, m: 1, mb: 2 }}/>

              <TextField sx={{ width: 1, height: '100%'}}
                id="outlined-multiline-static"
                label="Edit"
                maxRows={13}
                minRows={13}
                disabled = {false}
                inputProps={{ maxLength: 1700, style: { color: 'rgb(0,0,0)' } }}
                value={petDescriptionValue}
                onChange={(event) => {setPetDescription(event.target.value)}}
                multiline
              />
            </Box>

            <Box sx={{mt:2 ,textAlign:"center", height: '25',mb: 0, width: 0.85, mx: 'auto'}}>
              <Button className="delete-pet-button" variant="contained" size="large" color="success"  onClick={handleCreate} endIcon={<CheckIcon  sx={{mt:0, width:25, height:25}} />}>
                {(props.isUpdating) ? "Save" : "Create"}
              </Button>
            </Box>
          </div>
        </div>
    </Slide>
  </div>
  )
}

export default CreatePet
