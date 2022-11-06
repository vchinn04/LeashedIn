import * as React from "react"
import "./Feed.css"
import {temp} from '../components/tempPosts'
import {ScrollView} from 'react-native'
import Post from "../components/Post"

class Feed extends React.Component
{
  constructor(props) {
    console.log("Constructor Feed called!")

    super(props);
  }

  render() {
    return (
      <ScrollView> 
        {
          temp.map((post, index) => (
              <Post post = {post} />
          ))
        }
      </ScrollView>
    );
  }
}


export default Feed;