import * as React from "react"
import "./ProfilePage.css"
import { useParams } from 'react-router-dom'

import NavBar from "../components/NavBar/NavBar"

const ProfilePage = (props ) =>
{
  let { id } = useParams();

  console.log(id)
    return (
      <div className="main-frame">
        <NavBar setLoginState={props.setLoginState} />
        <div className="pic-frame">
          frame 1
        </div>
        <div className="about-me-frame">
          frame 2
        </div>
        <div className="pet-frame">
          frame 3
        </div>
      </div>
    );

}


export default ProfilePage;
