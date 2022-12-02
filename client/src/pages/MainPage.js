import * as React from "react"
import "./MainPage.css"
import Feed from './Feed'
//import {temp} from '../components/tempPosts'
//import {ScrollView} from 'react-native'
//import Post from "../components/Post/Post"
import NavBar from "../components/NavBar/NavBar"

class MainPage extends React.Component
{
  constructor(props) {
    console.log("Constructor MainPage called!")
    super(props);
  }

  render() {
    return (
      <div className="main-frame">
        <NavBar loginStatus={this.props.loginStatus} setLoginState={this.props.setLoginState} />
        <Feed loginStatus={this.props.loginStatus} setLoginState={this.props.setLoginState}/>
      </div>
    );
  }
}


export default MainPage;
