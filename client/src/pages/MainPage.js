import * as React from "react"
import "./MainPage.css"

class MainPage extends React.Component
{
  constructor(props) {
    console.log("Constructor MainPage called!")

    super(props);
  }

  render() {
    return (
      <div className="main-frame">
      </div>
    );
  }
}


export default MainPage;
