

import React from 'react'
import { Divider } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CommentIcon from '@mui/icons-material/Comment';
import TextField from '@mui/material/TextField';
import { Form, Container } from 'react-bootstrap';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { trusted } from 'mongoose';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import './Post.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import styled from "styled-components";

import { Link } from 'react-router-dom';


const Post = (props) => {
    const [countUp, setCountUp] = useState(0)
    const [clicked, setClicked] = useState(false)
    const [comment, setComment] = useState(false)

    useEffect(() => {
        setClicked(JSON.parse(window.localStorage.getItem('clicked')));
      }, []);
    
      useEffect(() => {
        window.localStorage.setItem('clicked', clicked);
      }, [clicked]);

    const updateLikes = (postInformation) => {
        var data = new FormData()
    
        console.log(postInformation.postId)
        console.log(postInformation.postLikes)
        data.append('postId', postInformation.postId)
        data.append('postLikes', postInformation.postLikes)
        fetch('/UpdatePostLikes',
          {
            method: 'POST',
            body: data
          }).then((response) => response.json())
    
          .then((result) => {
    
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      const updateLikes2 = (postInformation) => {
        var data = new FormData()
    
        console.log(postInformation.postId)
        console.log(postInformation.postLikes)
        data.append('postId', postInformation.postId)
        data.append('postLikes', postInformation.postLikes)
        fetch('/DecreaseLikes',
          {
            method: 'POST',
            body: data
          }).then((response) => response.json())
    
          .then((result) => {
    
            let postLikes = result
            console.log(postLikes)
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    return (
            <Container className = "Post" style={{ width: 500, height: 300}}>
                <div className = 'row'>
                    <IconButton className = 'row' color="primary" aria-label="profile"  component={Link} to={`/profile/${props.loginStatus}`}>
                        <Avatar src={props.profilePic} alt="Profile" />
                     </IconButton>
                    <div className = 'row' style = {{color: 'black', fontWeight: '700', }} > 
                                        {props.username} 
                                </div> 

                    <Button className = 'row' onClick={() => {props.deletePost(props.postInfo)}} color = "error" style={{marginLeft: 400}}>
                        <DeleteIcon/>
                    </Button>
                </div>
                    
  
            <Divider component="li" sx={{borderBottomWidth: 2, color: 'purple'}}/>

            <Box sx={{  height: '60%',mb: 0, mx: 'auto', color: "#7150BC",textAlign:"left", borderRadius: '15px' , marginTop: '15'}}>
                <Container style={{marginBottom: '30'}}>
                    <div style = {{color: 'black', fontWeight: 'normal', justifyContent: 'space-between'}} > 
                        {props.postInfo.postDescription} 
                    </div>
                </Container> 
            </Box>

                <Container style = {{color: 'black', fontWeight: 'normal', justifyContent: 'space-between'}}>
                     Likes: {props.likes} 
                </Container>
                <Divider component="li" sx={{marginLeft: '2%', marginRight: '2%', borderBottomWidth: 2}}/>
                <div className='row'>

                    <Button                 
                    onClick={() => 
                        {{if (clicked == false) {updateLikes(props.postInfo); setClicked(true)} else {updateLikes2(props.postInfo); setClicked(false)}}}} style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                        {clicked ? <ThumbUpIcon style = {{color: "black"}}/> : <ThumbUpOffAltIcon style = {{color: "black"}}/>}
                    </Button>
                    <div className='row' style = {{color: 'black', fontWeight: '700', marginRight: 15}} > 
                        Like 
                    </div> 
                    <Button onClick={() => 
                        {if (comment == false) {setComment(true)}}} style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                            <CommentIcon style={{color: 'black', marginTop: 2, maxWidth: '20px', maxHeight: '20px', minWidth: '20px', minHeight: '20px'}}/>
                    </Button>
                    <div className='row' style = {{color: 'black', fontWeight: '700'}} > 
                        Comment
                    </div> 
                    {comment ? <TextField id="outlined-basic"
                                name="Description"
                                label="Description"
                                fullWidth
                                margin="normal"
                                sx={{height:'10%'}}
                            /> : <div/>}
                </div>
            </Container>

    )
}




export default Post;



