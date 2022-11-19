// import * as React from "react"
// import "./Feed.css"
// import {temp} from '../components/tempPosts'
// import {SafeAreaView, StatusBar, StyleSheet, View, ScrollView, Text} from 'react-native'
// import Post from "../components/Post"
// import Button from '@mui/material/Button';
// import List from '@mui/material/List';
// import { Paper } from '@mui/material';

// /* class Feed extends React.Component
// {
//   constructor(props) {
//     console.log("Constructor Feed called!")

//     super(props);
//   }

//   render() {
//     return (
//       <View style={{ Height: "auto"}}>
//           <ScrollView>
//             {
//               temp.map((post, key) => (
//                   <Post post = {post} key = {post.key}/>
//               ))
//             }
//           </ScrollView>
//         </View>
//     );
//   }
// } */

// class Feed extends React.Component
// {
//   constructor(props) {
//     console.log("Constructor Feed called!")

//     super(props);
//   }

//   render() {
//     return (
//         <Paper style={{maxHeight: 800, maxWidth: 800, overflow: 'auto', backgroundColor: '#FAF9F6', margin: 100}}>
//           <View className = 'feed-frame'>
//             <List style = {{margin: 100}}>
//                 {temp.map((post, key) => (
//                           <Post post = {post} key = {post.key}/>
//                       ))}
//             </List>
//           </View>
//       </Paper>

//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     growflex: 1
//   },
// });


// export default Feed;
