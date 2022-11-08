import * as React from "react"
import "./MainPage.css"
import Feed from './Feed'
import {temp} from '../components/tempPosts'
import {ScrollView} from 'react-native'
import Post from "../components/Post"
class MainPage extends React.Component
{
  constructor(props) {
    console.log("Constructor MainPage called!")

    super(props);
  }

  render() {
    return (
      <div className="main-frame">          
        <Feed/>
      </div>
    );
  }
}


export default MainPage;
