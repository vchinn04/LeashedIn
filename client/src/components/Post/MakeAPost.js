
import Button from '@mui/material/Button';

import React from 'react';
import './Post.css';
import PopUp from './Popup'
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { Form, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';


import { AuthContext } from '../../context.js';

import { styled } from '@mui/material/styles';

/* const ColorButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#825DD7",
    '&:hover': {
      backgroundColor: "#7150BC",
    },
  }));

class MakeAPost extends React.Component
{
  constructor(props) {
    console.log("Constructor MakeAPost called!")

    super(props);

  }

  render() {
    return (
        <ColorButton variant="contained" size="large" sx={{ width: 1, fontWeight: 'bold' }}>
            Create A Post
        </ColorButton>
    );
  }
} */


const postList = []

const ColorButton = styled(Button)(({ theme }) => ({
    backgroundColor: "white",
    color: "#7150BC",
    '&:hover': {
      backgroundColor: "#7150BC",
      color: "white",
    },
  }));

  const ColorButton2 = styled(Button)(({ theme }) => ({
    backgroundColor: "#7150BC",
    color: "white",
    '&:hover': {
      backgroundColor: "white",
      color: "#7150BC",
    },
  }));

const MakeAPost = props => {
    const [postDescription, setPostDescription] = useState("")
    const [inputImage, setImage] = useState(null);
    const [inputImagePath, setImagePath] = useState(null);
    const [inputImageFile, setImageFile] = useState(null);


    const setUpFile = (file) =>
    {
      var reader  = new FileReader();
      reader.onload = function(e)  {
         setImage(e.target.result)
      }
      console.log(file)
      setImageFile(file)
      reader.readAsDataURL(file);
    }


    const handleFile = (event) =>
    {
      if (!event.target.files[0])
        return

      setImagePath(event.target.value)
      setUpFile(event.target.files[0])
    }

    
    const handlePostCreate = () => {
        console.log("hiii")

        const postInformation = {
            PostImage: ((inputImageFile) ? inputImageFile.name : ""),
            DisplayImage: inputImage,
            PostDescription: postDescription,
          }
          props.addPost(postInformation, inputImageFile)
          togglePopup()

    }

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
      }

    return (
        <div>
            <ColorButton2 variant="contained" size="large" sx={{ width: 1, fontWeight: 'bold', alignContent: 'center', marginBottom: 3}} onClick={togglePopup}>
                               Create A Post
            </ColorButton2>
            <div sx={{ alignItems: 'center'}}>
                {isOpen && <PopUp
                content={<>
                    <TextField id="outlined-basic"
                                name="Description"
                                label="Description"
                                fullWidth
                                margin="normal"
                                onChange={(event) => {setPostDescription(event.target.value)}}
                            />
                    <img className = "image"
                        src={inputImage}
                    />
                    <ColorButton2 variant="contained" component="label" color="primary"  size="small" sx={{fontWeight: 'bold', marginBottom: 5}}>
                        Image Upload
                    <input hidden accept="image/*" type="file" onChange={handleFile}/>
                    </ColorButton2>
                    <ColorButton2 variant="contained" size="small" sx={{ width: 1, fontWeight: 'bold', alignContent: 'center', marginBottom: 3}} onClick={handlePostCreate}>
                                POST
                    </ColorButton2>
                </>}
                handleClose={togglePopup}
                />}
            </div>
        </div>
    )
}

export default MakeAPost;
