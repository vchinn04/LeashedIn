
import * as React from "react"
import "./ProfilePage.css"
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import "./Feed.css"
import List from '@mui/material/List';
import { Paper } from '@mui/material';
import MakeAPost from '../components/Post/MakeAPost'

import NavBar from "../components/NavBar/NavBar"
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { Form, Container } from 'react-bootstrap';
import Post from "../components/Post/Post"
import Comments from "../components/Comments"

import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PetDisplay from "../components/PetComponents/PetDisplay"
import CreatePet from "../components/PetComponents/CreatePet"

const postListT = []
const totalListT = []

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

const Feed = (props ) =>
{
  let { id } = useParams();
  const [aboutState, setAboutState] = useState("");
  const [isEditing, setEdit] = useState(false);
  const [ownerName, setName] = useState("Victor Chinnappan");
  const [inputImage, setImage] = useState(null);
  const [inputImagePath, setImagePath] = useState(null);
  const [inputImageFile, setImageFile] = useState(null);

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
  const [postList, setPostList] = useState(postListT);
  const [currentPost, setCurrentPost] = useState(null);
  const [totalPostList, setTotalPostList] = useState(totalListT);


  const addPost = (postInformation, inputImageFile) => {
    var data = new FormData()
  //  if (postInformation.PostImage)
   //   data.append('postimage', inputImageFile, inputImageFile.name)

    console.log(inputImageFile)
    console.log(postInformation.PostImage)
    data.append('PostDescription', postInformation.PostDescription)
    data.append('userIndex', props.loginStatus)
    fetch('/UserCreatePost',
      {
        method: 'POST',
        body: data
      }).then((response) => response.json())

      .then((result) => {

        let postListNew = postList
        postListNew.push(result)
        const results = postListNew.filter(element => {
            return element !== null;
          });
        setPostList(results)
        let likes = result.postLikes
        console.log(likes)
        console.log(postList)
        setCurrentPost(null)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      fetch('/GetEveryUserPosts').then((response) => response.json())

      .then((result) => {

        let totalPostListNew = []
        result.forEach((element) => {
            if (element !== null) {
              totalPostListNew.push(element);
            }
          });
        setTotalPostList(totalPostListNew)

        console.log(result)
        console.log(totalPostListNew)
        console.log(totalPostList)

      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  

  const deletePost = (postEntry) =>
  {
    console.log("Delete post!")

    let index = -1
    for (let i = 0; i < postList.length; i++) {
      if (postList[i].postId == postEntry.postId){
        index = i
        break
      }
    }


    if (index > -1)
    {
      const url = '/DeletePost?' + new URLSearchParams({ postId: postList[index].postId, userIndex: props.loginStatus }).toString()

      fetch(url, {
        method: 'DELETE',
      }).then((response) => response.json())

      .then((result) => {
         console.log('Success:', result.returnValue);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
        postList.splice(index, 1);

    }



    setCurrentPost(null);
    setPostList(postList)

    window.location.reload();

  }

  const handleFile = (event) =>
  {
    if (!event.target.files[0])
      return

    setImagePath(event.target.value)
    setUpFile(event.target.files[0])
  }

  const handlePostOpen = (ev, postName) =>
  {
    setCurrentPost(postName);
  }

  useEffect(() => {
    const getData = async() => {
      const url = '/getUserProfileText?' + new URLSearchParams({ username: props.loginStatus }).toString()
      const getPfpURL = '/getUserProfilePic?' + new URLSearchParams({ username: props.loginStatus }).toString()
      const getPostListURL = '/getUserPosts?' + new URLSearchParams({ username: props.loginStatus }).toString()
      const getEveryPostListURL = '/getEveryUserPosts?'


      fetch(getPostListURL).then((response) => response.json())
       .then((result) => {
         console.log('Info retrieval success!');
         if (result)
           var finalArr = []
           var promiseArr = [];
           for (let i of result)
           {
 
              finalArr.push(i)
            }

               Promise.all(promiseArr).then(() =>
               {
                 setPostList(result)

                 fetch(url).then((response) => response.json())
                 .then((result) => {
                   console.log('Info retrieval success!');
                   if (result.PostDescription)
                     setAboutState(result.postDescription)

                 //  if (result.ownerName)
                   //  setName(result.ownerName)
                 })
                 .catch((error) => {
                   console.error('Error:', error);
                 });
               })
       })
       .catch((error) => {
         console.error('Error:', error);
       });


       fetch(url)
       .then(async (result) => {
         console.log('File retrieval success!');
         let myBlob = await result.blob()
 
          var reader  = new FileReader();
          reader.onload = function(e)  {
              setImage(e.target.result)
           }
           reader.readAsDataURL(myBlob);
       })
       .catch((error) => {
         console.error('Error:', error);
       });

       
    }

    getData()

  }, []);


  return (
    <Container>
        <Paper style={{maxHeight: 800, maxWidth: 1000, overflow: 'auto', backgroundColor: '#825DD7', margin: 500}}>
        <Container style={{alignContent: 'center'}}>
            <List style = {{margin: 100, alignContent:'center', width: 800, height: 700}}>
                <MakeAPost  addPost={addPost} setCurrentPost={setCurrentPost}/>
                    {
                        postList.map((element) => {
                            return (
                            <Post key={element.postId} postInfo = {element} username = {props.loginStatus} deletePost={deletePost} likes = {element.postLikes} profilePic = {inputImage}>
                            </Post>
                            )
                            })
                    }
                </List>
            </Container>
        </Paper>
      </Container>

    );

}

export default Feed;
