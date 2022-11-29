import * as React from "react"
import "./ProfilePage.css"
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';

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
import PetDisplay from "../components/PetComponents/PetDisplay"
import CreatePet from "../components/PetComponents/CreatePet"

const petListT = []

const EditSaveButton = (props) =>
{
  if (!(props.isEditing)) return(
    <IconButton sx={{ mb: 0, ml: '95%' }} centerRipple={false} size="large" aria-label="edit profile" onClick={() => {props.setEdit(true)}}>
      <EditIcon />
    </IconButton>
  )
  else
    return (
      <Chip label="Save" color="success"  size="medium" sx={{mt:1, mb: 1, ml: '94%' ,fontWeight: 'bold' }} onClick={() => {props.handleSubmit()}}/>
    )
}

const ProfilePage = (props ) =>
{
  let { id } = useParams();
  const [aboutState, setAboutState] = useState("");
  const [isEditing, setEdit] = useState(false);
  const [ownerName, setName] = useState("Victor Chinnappan");
  const [inputImage, setImage] = useState(null);
  const [inputImagePath, setImagePath] = useState(null);
  const [inputImageFile, setImageFile] = useState(null);
  const [petList, setPetList] = useState(petListT);
  const [currentPet, setCurrentPet] = useState(null);

  const avatarMarginTop = (props.loginStatus == id) ? -2 : 4

  const setUpFile = (file) =>
  {
    var reader  = new FileReader();
    reader.onload = function(e)  {
       setImage(e.target.result)
    }
    setImageFile(file)
    reader.readAsDataURL(file);
  }

  const handleSubmit = () =>
  {
    var data = new FormData()
    data.append('image',inputImageFile, inputImageFile.name)
    data.append('username', props.loginStatus)
    data.append('ownername', ownerName)
    data.append('aboutme', aboutState)

    fetch('/UpdateProfile',
      {
        method: 'POST',
        body: data
      }).then((response) => response.json())

      .then((result) => {
         console.log('Success:', result.loginStatus);
         setEdit(false)
         setImagePath(null)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }

  const handlePetAdd = (petInformation, inputImageFile) => {
    var data = new FormData()

    if (petInformation.PetImage)
      data.append('petimage', inputImageFile, inputImageFile.name)

    data.append('PetType', petInformation.PetType)
    data.append('PetName', petInformation.PetName)
    data.append('PetDescription', petInformation.PetDescription)
    data.append('userIndex', props.loginStatus)

    fetch('/CreatePet',
      {
        method: 'POST',
        body: data
      }).then((response) => response.json())

      .then((result) => {
        console.log('Success:', result.PetName);

        let petListNew = petList

        result["DisplayImage"] = petInformation.DisplayImage
        petListNew.push(result)

        setPetList(petListNew)
        setCurrentPet(null)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const deletePet = (petEntry) =>
  {
    console.log("Delete pet!")

    let index = -1
    for (let i = 0; i < petList.length; i++) {
      if (petList[i].PetId == petEntry.PetId){
        index = i
        break
      }
    }


    if (index > -1)
    {
      const url = '/DeletePet?' + new URLSearchParams({ petId: petList[index].PetId, userIndex: props.loginStatus }).toString()

      fetch(url, {
        method: 'DELETE',
      }).then((response) => response.json())

      .then((result) => {
         console.log('Success:', result.returnValue);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
        petList.splice(index, 1);

    }

    setCurrentPet(null);
    setPetList(petList)
  }

  const handleFile = (event) =>
  {
    if (!event.target.files[0])
      return

    setImagePath(event.target.value)
    setUpFile(event.target.files[0])
  }

  const handlePetOpen = (ev, petName) =>
  {
    setCurrentPet(petName);
  }

  useEffect(() => {
    const getData = async() => {
      const url = '/getUserProfileText?' + new URLSearchParams({ username: props.loginStatus }).toString()
      const getPfpURL = '/getUserProfilePic?' + new URLSearchParams({ username: props.loginStatus }).toString()
      const getPetListURL = '/getUserPets?' + new URLSearchParams({ username: props.loginStatus }).toString()

      fetch(getPetListURL).then((response) => response.json())
       .then((result) => {
         console.log('Info retrieval success!');
         if (result)
           var finalArr = []
           var promiseArr = [];

           for (let i of result)
           {
             if (i["PetImage"] == "")
                continue

              const petPicURL = '/getPetPic?' + new URLSearchParams({ imagePath: i["PetImage"] }).toString()

              promiseArr.push(fetch(petPicURL)
                 .then(async (result) => {
                   console.log('File retrieval success!');
                   let myBlob = await result.blob()

                   var reader  = new FileReader();
                   reader.onload = function(e)  {
                     i["DisplayImage"] = e.target.result
                   }

                   reader.readAsDataURL(myBlob);
                 })

                .catch((error) => {
                  console.error('Error:', error);
                })
             );
              finalArr.push(i)
            }

               Promise.all(promiseArr).then(() =>
               {
                 setPetList(result)

                 fetch(url).then((response) => response.json())
                 .then((result) => {
                   console.log('Info retrieval success!');
                   if (result.aboutMe)
                     setAboutState(result.aboutMe)

                   if (result.ownerName)
                     setName(result.ownerName)
                 })
                 .catch((error) => {
                   console.error('Error:', error);
                 });

                 fetch(getPfpURL)
                 .then(async (result) => {
                   console.log('File retrieval success!');
                   let myBlob = await result.blob()

                   setUpFile(myBlob)
                 })
                 .catch((error) => {
                   console.error('Error:', error);
                 });
               })
       })
       .catch((error) => {
         console.error('Error:', error);
       });
    }

    getData()

  }, []);

  return (
      <div className="profile-page-frame">

        <NavBar loginStatus={props.loginStatus} setLoginState={props.setLoginState} />
        {currentPet && ((currentPet == "add") ? <CreatePet  handlePetAdd={handlePetAdd} petInfo={"add"} setCurrentPet={setCurrentPet}/> : <PetDisplay  deletePet={deletePet} petInfo={currentPet} setCurrentPet={setCurrentPet}/>)}
        <div className="info-frame">

          <div className="pic-frame">

            {(props.loginStatus == id) && <EditSaveButton isEditing={isEditing} setEdit={setEdit} handleSubmit={handleSubmit}/>}

            <Avatar
              alt="vchinn"
              src={(inputImage) ? inputImage : '/Eduardo.jpeg'}
              sx={{mx: 'auto', mt: avatarMarginTop, pt: 0, width: 175, height: 175, border: '5px solid #825DD7'}}
            />

            {isEditing && <Button variant="contained" component="label" color="primary"  size="small" sx={{position: 'absolute', top: '35%', mb:0, left: '60%' ,fontWeight: 'bold' }}>
              Upload
              <input hidden accept="image/*" type="file" onChange={handleFile}/>
             </Button>}

             {isEditing && <h3 className="path-text">{inputImagePath}</h3>}

            <Divider variant="middle" sx={{ m: 2, mb: -1 }}/>

            {(!isEditing) ?  <h1 className="username">{ownerName}</h1> : <TextField hiddenLabel size="large" id="standard-basic" value={ownerName} variant="standard" sx={{ml: '25%', textAlign: 'center', width: 500}}
              inputProps={{style: {fontSize: 32, color: '#825DD7', textAlign: 'center',fontFamily: 'Verdana', fontWeight: "bold"}}} onChange={(event) => {setName(event.target.value)}}
            />}

            <h2 className="subname">@{props.loginStatus}</h2>
          </div>

          <div className="about-me-frame">

            <h1 className="section-title">About Me</h1>
            <Divider variant="middle" sx={{ m: 2, mb: 2 }}/>

            <Box sx={{  height: '75%',mb: 2, width: 0.97, mx: 'auto'}}>
              <TextField sx={{ width: 1, height: '100%'}}
                 id="outlined-multiline-static"
                 label={isEditing ? "Edit" : ""}
                 maxRows={13}
                 minRows={13}
                 disabled = {!isEditing}
                 inputProps={{ maxLength: 1700, style: { color: 'rgb(0,0,0)' } }}
                 value={aboutState}
                 onChange={(event) => {setAboutState(event.target.value)}}
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
                           <IconButton className="gridButton" centerRipple={false} color="primary" aria-label="profile" style={{backgroundColor:'rgba(130, 93, 215, 0'}} onClick={(event) => {handlePetOpen(event, element)}} >
                                <Avatar className="grid-avatar" src={element.DisplayImage} alt="Profile" variant="rounded" sx={{  width: 95, height: 95 }} />
                              <Chip  className="name-chip" size="small"  color="secondary"  style={{backgroundColor:'rgba(130, 93, 215, 0.7'}} label={element.PetName} sx={{ zIndex: 20 }}/>
                           </IconButton>
                       </Grid>
                      )
                    })
                  }

                  {
                    (petList.length < 12) && (
                        <Grid item xs={1.75}>
                           <IconButton className="IconButton" centerRipple={false} color="primary" aria-label="profile" size="xlarge" onClick={() => {setCurrentPet("add")}} >
                              <AddBoxIcon sx={{color: "#825DD7", width:'95px', height:95}} />
                           </IconButton>
                        </Grid>
                     )
                  }
                </Grid>
              </Box>
          </div>

        </div>
      </div>
    );

}

export default ProfilePage;
