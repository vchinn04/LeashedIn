import * as React from "react"
import "./Homepage.css"
import Login from "../components/Login/Login"
import { useLocation } from 'react-router-dom'

class HomePage extends React.Component
{
  constructor(props) {
    console.log("Constructor homepage called!")

    super(props);
    this.state = {
      renderedResponse: ''
    };

  }

  render() {

    return (
      <div className="main-frame">
        <div className="homepage-stripe-background">
          <div className="description-frame">
            <h2 className="logo-text">LeashedIn</h2>
            <p className="app-description"><span>The way to connnect with fellow</span><span>pet owners, companies, and dog parks!</span></p>
          </div>

          <Login setLoginState={this.props.setLoginState} />
        </div>
      </div>
    );
  }
}


export default HomePage;
