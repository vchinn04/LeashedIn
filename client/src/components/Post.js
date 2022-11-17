// import React from 'react'
// import { Divider } from '@mui/material';
// import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
// import CommentIcon from '@mui/icons-material/Comment';
// import TextField from '@mui/material/TextField';
// import { Form, Container } from 'react-bootstrap';
// import Box from '@mui/material/Box';
// import {View, Text, Image, StyleSheet} from 'react-native'
// import Button from '@mui/material/Button';
// import { useState } from 'react';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
// import { trusted } from 'mongoose';

// const Post = ({post})=> {


//     const [countUp, setCountUp] = useState(0)
//     const [countDown, setCountDown] = useState(0)
//     const [clicked, setClicked] = useState(false)
//     return (
//         <View className = 'post-frame'>
//             <View style={{marginBottom: 30, flexDirection: 'column', alignItems: 'left', outlineColor: "black",outlineStyle: "solid",outlineWidth: 1, flex: 1, backgroundColor: 'white'}}>
//                 <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 5, alignItems: 'center'}} >
//                     <View style = {{flexDirection: 'row', alignItems: 'center'}} >
//                         <Image style={styles.image} source={{ uri: post.profile_picture}}/>
//                         <Text style = {{color: 'black', fontWeight: '700'}} > 
//                                     {post.username} 
//                             </Text> 
//                     </View>
//                 </View>
                

//                 <View style={{flexDirection: 'column', justifyContent: 'space-between', margin: 5, alignItems: 'left'}} >
//                     <Text style = {{color: 'black', fontWeight: 'normal', justifyContent: 'space-between'}} > 
//                         {post.description} 
//                     </Text>
//                     <img
//                         src={post.image} style={{ width: 500, height: 300 }}
//                     />
//                 </View> 
//                 <View style = {{color: 'black', fontWeight: 'normal', justifyContent: 'space-between'}}>
//                      Likes: {`${countUp}`} 
//                 </View>
//                 <Divider component="li" sx={{marginLeft: '2%', marginRight: '2%', borderBottomWidth: 2, marginTop: 2}}/>
//                 <View style={{flexDirection: 'row', margin: 5, alignItems: 'center'}} >
//                     <Button onClick={() => 
//                         {{if (countUp < 1) {setCountUp(countUp + 1); setClicked(true)} else {setCountUp(countUp - 1); setClicked(false)}}}} style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
//                         {clicked ? <ThumbUpIcon style = {{color: "black"}}/> : <ThumbUpOffAltIcon style = {{color: "black"}}/>}
//                     </Button>
//                     <Text style = {{color: 'black', fontWeight: '700', marginRight: 15}} > 
//                         Like 
//                     </Text> 
//                     <CommentIcon style={{color: 'black'}}/>
//                     <Text style = {{color: 'black', fontWeight: '700', marginRight: 15}} > 
//                         Comment
//                     </Text> 
//                 </View>
//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     profilepic: {
//       flex: 1,
//       alignItems: "center",
//     },
//     username: {
//         flex: 1,
//         alignItems: "center",
//       },
//     // styling the image
//     image: {
//         width: 40,
//         height: 40,
//         borderRadius: 35,
//     },
//   });


// export default Post;
