
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
const totalListTwo = []
const postArrT = []


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
  const [postArr, setPostArr] = useState([]);


  const getPosts = async() => {
    const url = '/getPostArr?' //Fire get event to find users with search string in their usernames
    const response = await fetch(url);
    const body= await response.json();

    let postArray = JSON.parse(body.postList)

    return postArray

}



  const addPost = (postInformation, inputImageFile) => {
    var data = new FormData()

    if (postInformation.PostImage)
      data.append('postimage', inputImageFile, inputImageFile.name)


    data.append('PostDescription', postInformation.PostDescription)
    data.append('userIndex', props.loginStatus)

    fetch('/UserCreatePost',
      {
        method: 'POST',
        body: data
      }).then((response) => response.json())

      .then((result) => {
        let postListNew = postList
        result["DisplayImage"] = postInformation.DisplayImage // if it was succesful add the image sent back from server to pet entry

        postListNew.push(result)

        setPostList(postListNew)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      getPosts()
      .then(res => {
        const someData = res;
        let postArray = res
        if (postArray.length == 0) //If no users found then push a "fake" user to display that no users found
        {
          postArray.push(
            {
              _id: -1, //assign _id to -1 in order for the button to be disabled
            }
          )
        }
        setPostArr(postArray)
      })
      window.location.reload(false)



  }

  const deletePost = (postEntry) =>
  {
    console.log("Delete post!")

    let index = -1
    for (let i = 0; i < postArr.length; i++) {
      if (postArr[i].postId == postEntry.postId){
        if (postArr[i].username == props.loginStatus) {
            index = i
            break
        }
      }
    }




    if (index > -1)
    {
      const url = '/DeletePost?' + new URLSearchParams({ postId: postArr[index].postId, userIndex: props.loginStatus }).toString()

      fetch(url, {
        method: 'DELETE',
      }).then((response) => response.json())

      .then((result) => {
         console.log('Success:', result.returnValue);
         window.location.reload(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
        postArr.splice(index, 1);


    }



    setPostArr(postArr)



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

    getPosts()
        .then(res => {
          const someData = res;
          let postArray = res
          if (postArray.length == 0) //If no users found then push a "fake" user to display that no users found
          {
            postArray.push(
              {
                _id: -1, //assign _id to -1 in order for the button to be disabled
              }
            )
          }
          setPostArr(postArray)
          console.log(postArray)
        })



      const url = '/getUserProfileText?' + new URLSearchParams({ username: props.loginStatus }).toString()
      const getPfpURL = '/getUserProfilePic?' + new URLSearchParams({ username: props.loginStatus }).toString()
      const getPostListURL = '/getPostList?'

      var promiseArr = [];
      var finalArr = []

      fetch(getPostListURL).then((response) => response.json())
       .then((result) => {
         console.log('Info retrieval success!');
         if (result)
           for (let i of result)
           {
             if (i.postImage == '')
                continue
              const postPicURL = '/getPostPic?' + new URLSearchParams({ imagePath: i["postImage"] }).toString()

              promiseArr.push(fetch(postPicURL)
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
             fetch(getPfpURL)
             .then(async (result) => {
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
            setPostArr(finalArr)
          });

       })
       .catch((error) => {
         console.error('Error:', error);
       });
    }

    getData()

  }, []);


  return (
    <Container>
        <Paper style={{maxHeight: 800, maxWidth: 1000, overflow: 'auto', backgroundColor: '#EEEFF1', margin: 500}}>
        <Container style={{alignContent: 'center'}}>
            <List style = {{margin: 100, alignContent:'center', width: 800, height: 700}}>
                <MakeAPost  addPost={addPost} setCurrentPost={setCurrentPost}/>
{/*                     {
                        postList.reverse().map((element) => {
                            return (
                            <Post key={element.postId} postInfo = {element} username = {props.loginStatus} deletePost={deletePost} likes = {element.postLikes} profilePic = {inputImage}>
                            </Post>
                            )
                            })
                    } */}

                    {
                        (postArr.length > 0) && (postArr[0]._id != -1) && postArr.slice(0).reverse().map((element) => {
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
