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

const EditSaveButton = (props) => // return edit button or save/cancel buttons depending on edit state
{
  if (!(props.isEditing)) return(
    <IconButton sx={{ mb: 0, ml: '95%' }} centerRipple={false} size="large" aria-label="edit profile" onClick={() => {props.setEdit(true)}}>
      <EditIcon />
    </IconButton>
  )
  else
    return (
      <>
        <Chip label="Save" color="success"  size="medium" sx={{mt:1, mb: 0, ml: '94%' ,fontWeight: 'bold' }} onClick={() => {props.handleSubmit()}}/>
        <Chip label="Cancel" color="error"  size="medium" sx={{position: 'absolute', top:'45px', mb: 1, left: '93%' ,fontWeight: 'bold' }} onClick={() => {props.cancelSubmit()}}/>
      </>
    )
}

const ProfilePage = (props) =>
{
  let { id } = useParams(); // access the query parameter passed in
  const [currentId, setCurrentId] = useState(id);
  const [aboutState, setAboutState] = useState(""); // Stores the owners about me text
  const [isEditing, setEdit] = useState(false); // boolean that stores wether user is editing page or not
  const [ownerName, setName] = useState(""); // stores the owner's name
  const [inputImage, setImage] = useState(null); // stores the processed image for use with avatar
  const [inputImagePath, setImagePath] = useState(null); // stores the path to uploaded image
  const [inputImageFile, setImageFile] = useState(null); // stores the image file
  const [followersList, setFollowersList] = useState([]); // Stores the owners about me text
  const [petList, setPetList] = useState([]); // stores a list of pet entries
  const [currentPet, setCurrentPet] = useState(null); // stores a pet entry (when selected)

  const avatarMarginTop = (props.loginStatus == id) ? -2 : 4 // just stores the top margin of avatar

  /*---------FILE HANDLERS----------*/
  const setUpFile = (file) => // handles the processing of image file/blob and stores it in "inputImage"
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
    if (!event.target.files[0]) // if there wasnt a file uploaded, just return
      return

    setImagePath(event.target.value) // update the image path
    setUpFile(event.target.files[0]) // process the file
  }

  const removeFile = (event) => // in charge of handling a file when its uploaded
  {
    setImagePath("") // update the image path
    setImage(null)
    setImageFile(null)
  }
  /*----------------------------------*/

  /*---------SUBMIT FUNCTIONS----------*/
  const handleSubmit = () => // save updated info to server
  {
    var data = new FormData() // This way we can pass an image file and other args to server

    if (inputImageFile)
      data.append('image',inputImageFile, inputImageFile.name)

    data.append('username', props.loginStatus)
    data.append('ownername', ownerName)
    data.append('aboutme', aboutState)

    fetch('/UpdateProfile', // Update server event fired
    {
      method: 'PUT',
      body: data
    }).then((response) => response.json())

    .then((result) => { // if it was successful, exit editing and remove image path
      console.log('Success:', result.loginStatus);
      setEdit(false)
      setImagePath(null)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const cancelSubmit = () => // re-fetch all the users info and exit editing mode
  {
    setEdit(false)
    setImagePath(null)
    setUpFunction()
  }
  /*----------------------------------*/

  const handleFollowers = () =>
  {

    var data = {
      username: props.loginStatus,
      usernameOther: id
    }
    fetch('/UpdateFollowers', // Update the followers list
    {
      method: 'POST',
      headers: { "Content-Type": "application/json",
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => response.json())

    .then((result) => { // if it was successful, update the followers list
      console.log('Success:', result.loginStatus);
      setFollowersList(result.followerArr)

    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  /*---------PET FUNCTIONS----------*/
  const handlePetAdd = (petInformation, inputImageFile) => // handle the creation of a new pet
  {
    var data = new FormData()

    if (petInformation.PetImage)
      data.append('petimage', inputImageFile, inputImageFile.name)

    data.append('PetType', petInformation.PetType)
    data.append('PetName', petInformation.PetName)
    data.append('PetDescription', petInformation.PetDescription)
    data.append('userIndex', props.loginStatus)

    fetch('/Pets', // fire server event
    {
      method: 'POST',
      body: data
    }).then((response) => response.json())
    .then((result) =>
    {
      console.log('Success:', result.PetName);

      let petListNew = petList

      result["DisplayImage"] = petInformation.DisplayImage // if it was succesful add the image sent back from server to pet entry
      petListNew.push(result) // add it to the list of pet entries

      setPetList(petListNew) // update state
      setCurrentPet(null)
    })
    .catch((error) =>
    {
      console.error('Error:', error);
    });
  }

  const handlePetUpdate = (petInformation, inputImageFile) => // this handles the updating function of pet
  {
    var data = new FormData()

    if (petInformation.PetImage)
      data.append('petimage', inputImageFile, inputImageFile.name)

    data.append('PetType', petInformation.PetType)
    data.append('PetName', petInformation.PetName)
    data.append('PetDescription', petInformation.PetDescription)
    data.append('userIndex', props.loginStatus)
    data.append('petId',petInformation.PetId)
    data.append('fileRemoved',petInformation.fileRemoved)

    // update pet locally
    currentPet.PetType = petInformation.PetType
    currentPet.PetName = petInformation.PetName
    currentPet.PetDescription = petInformation.PetDescription
    currentPet.PetImage = petInformation.PetImage
    currentPet.DisplayImage = petInformation.DisplayImage

    fetch('/Pets', // fire a PUT event for server
    {
      method: 'PUT',
      body: data
    }).then((response) => response.json())
    .then((result) =>
    {
      console.log('Success:', result.PetName);
      currentPet.PetImage = result.PetImage // if it was successful, update the local image
      setCurrentPet(null) // remove current pet to remove the pet component
    })
    .catch((error) =>
    {
      console.error('Error:', error);
    });
  }

  const deletePet = (petEntry) => // handle the deletion of a pet
  {
    console.log("Delete pet!")

    let index = -1
    for (let i = 0; i < petList.length; i++) { // find the index
      if (petList[i].PetId == petEntry.PetId)
      {
        index = i
        break
      }
    }


    if (index > -1) // if index found
    {
      const url = '/Pets?' + new URLSearchParams({ petId: petList[index].PetId, userIndex: props.loginStatus }).toString()

      fetch(url, { // fire a delete server event
        method: 'DELETE',
      }).then((response) => response.json())
      .then((result) =>
      {
        console.log('Success:', result.returnValue);
      })
      .catch((error) =>
      {
        console.error('Error:', error);
      });

      petList.splice(index, 1);
    }

    setCurrentPet(null);
    setPetList(petList) // update list
  }

  const handlePetOpen = (ev, petName) => // this simply sets current pet to the sepcified pet entry, when current pet is not empty, the pet component is rendered for that pet
  {
    setCurrentPet(petName);
  }
  /*-----------------------------*/

  /*---------SET-UP FUNCTIONS----------*/
  const setUpFunction = () => {
    const getData = async() => {
      console.log("PROFILE PAGE FOR USER: " + id)
      const url = '/getUserProfileText?' + new URLSearchParams({ username: id }).toString()
      const getPfpURL = '/getUserProfilePic?' + new URLSearchParams({ username: id }).toString()
      const getPetListURL = '/getUserPets?' + new URLSearchParams({ username: id }).toString()

      fetch(getPetListURL).then((response) => response.json())
       .then((result) => {
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
                     console.log(i["DisplayImage"])
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
                   console.log('Profile Information retrieval success!');
                   setAboutState(result.aboutMe)
                   setName(result.ownerName)
                   if (result.followers)
                    setFollowersList(result.followers)
                 })
                 .catch((error) => {
                   console.error('Error:', error);
                 });

                 fetch(getPfpURL)
                 .then(async (result) => {
                   console.log('Profile Picture retrieval success!');
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
  }

  useEffect(() => {
    setUpFunction()
  }, []); // called when its first rendered

  if (id != currentId) // if we change to another users page, then fetch all the info again
  {
    setCurrentId(id)
    setUpFunction()
  }
  /*----------------------------------*/

  return (
      <div className="profile-page-frame">

        <NavBar loginStatus={props.loginStatus} setLoginState={props.setLoginState} />

        {currentPet && ((currentPet == "add") ? <CreatePet  handlePetAdd={handlePetAdd} petInfo={"add"} setCurrentPet={setCurrentPet}/> : <PetDisplay  canEdit={(props.loginStatus == id)} handlePetUpdate={handlePetUpdate} deletePet={deletePet} petInfo={currentPet} canEdit={(props.loginStatus == id)} setCurrentPet={setCurrentPet}/>)}

        <div className="info-frame">
          <div className="pic-frame">

            {(props.loginStatus == id) && <EditSaveButton isEditing={isEditing} cancelSubmit={cancelSubmit} setEdit={setEdit} handleSubmit={handleSubmit}/>}
            {(props.loginStatus != id) && <Chip label={(followersList.includes(props.loginStatus)) ? "Unfollow" : "Follow" } color={(followersList.includes(props.loginStatus)) ? "error" : "primary" }  size="medium" sx={{position: 'absolute', top:'9px', mb: 1, left: '1%' ,fontWeight: 'bold' }} onClick={handleFollowers}/>}

            <Avatar
              src={inputImage}
              sx={{mx: 'auto', mt: avatarMarginTop, pt: 0, width: 175, height: 175, border: '5px solid #825DD7'}}
            />

            {isEditing && <Button variant="contained" component="label" color="primary"  size="small" sx={{position: 'absolute', top: '29.5%', mb:0, left: '60%' ,fontWeight: 'bold' }}>
                Upload
                <input hidden accept="image/*" type="file" onChange={handleFile}/>
             </Button>
            }

            {isEditing && <Button variant="contained" component="label" color="error"  size="small" sx={{position: 'absolute', top: '42.5%', mb:0, left: '60%' ,fontWeight: 'bold' }} onClick={removeFile}>
              Remove
            </Button>
            }

            {isEditing && <h3 className="path-text">{inputImagePath}</h3>}

            <Divider variant="middle" sx={{ m: 2, mb: -1 }}/>

            {(!isEditing) ?  <h1 className="username">{ownerName}</h1> : <TextField hiddenLabel size="large" id="standard-basic" value={ownerName} variant="standard" sx={{ml: '25%', textAlign: 'center', width: 500}}
              inputProps={{style: {fontSize: 32, color: '#825DD7', textAlign: 'center',fontFamily: 'Verdana', fontWeight: "bold"}}} onChange={(event) => {setName(event.target.value)}}
              />
            }

            <h2 className="subname">@{id} | Followers: {followersList.length}</h2>
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
                   petList.map((element) => { // generate buttons for pets
                      return (
                       <Grid key={element.PetId} item xs={1.75}>
                           <IconButton className="gridButton" centerRipple={false} color="primary" aria-label="profile" style={{backgroundColor:'rgba(130, 93, 215, 0'}} onClick={(event) => {handlePetOpen(event, element)}} >
                                <Avatar className="grid-avatar" src={element.DisplayImage} variant="rounded" sx={{  width: 95, height: 95 }} />
                              <Chip  className="name-chip" size="small"  color="secondary"  style={{backgroundColor:'rgba(130, 93, 215, 0.7'}} label={element.PetName} sx={{ zIndex: 20 }}/>
                           </IconButton>
                       </Grid>
                      )
                    })
                  }

                  {
                    ((props.loginStatus == id) && (petList.length < 12)) && ( // this is the add more pets button that appears when a user has less than 12 pets
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
