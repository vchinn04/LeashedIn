import React from 'react'
import { Divider } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CommentIcon from '@mui/icons-material/Comment';
import TextField from '@mui/material/TextField';
import { Form, Container } from 'react-bootstrap';
import Box from '@mui/material/Box';



const Post = ({post})=> {
    return (
        <Container className='feedContainer' fluid>
            <Header post = {post} />
            <Description post = {post} />
            <Footer post = {post} />
        </Container>
    )
}


const Header = ({post}) => {
    <Container className='feedheaderContainer' fluid>
        <Box
            component="img"
        //    sx={{
         //   height: 233,
        //    width: 350,
         //   maxHeight: { xs: 233, md: 167 },
         //   maxWidth: { xs: 350, md: 250 },
         //   }}
            src={{url: post.profile_picture}}
        />
        <TextField value = {post.username} />
    </Container>
}

const Description = ({post}) => {
    <Container className='feedDescriptionContainer' fluid>
        <Box
            component="img"
        //    sx={{
         //   height: 233,
        //    width: 350,
         //   maxHeight: { xs: 233, md: 167 },
         //   maxWidth: { xs: 350, md: 250 },
         //   }}
            alt={post.description}
            src={{url: post.image}}
      />
    </Container>
}

const Footer = ({post}) => {
    <Container className='feedFooterContainer' fluid>
        <Divider/>
        <ThumbUpOffAltIcon/>
        <CommentIcon/>
    </Container>
}

export default Post;