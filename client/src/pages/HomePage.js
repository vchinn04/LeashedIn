import * as React from "react"
import "../styles/Homepage.css"

class HomePage extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      renderedResponse: ''
    };
  }


  componentDidMount() {
    var testinng = {
      dataKey: "quang",
      dataVTheDeeloper68!
       {
        "money": 10,
        "status": "bo..."
      }
    }
    var myString = JSON.stringify(testinng);
    fetch('/PostTestEvent',{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testinng),
      }) .then((response) => response.text())

      .then((result) => {
        console.log('Success:', result);
      })
      .catch((error) => {
        console.log("Noo")
        console.error('Error:', error);
      });
  }

  render() {
    return (
      <div id="HomePageFrame">
        <div id="MainTextFrame">
          <h2 id="IntroText">Hi, my name is</h2>
          <p id="WebDescription"><span>   I am a programmer/scripter</span><span>and I welcome you to my website!</span><span>Here you can see my projects, education, etc, using the topbar!</span></p>
        </div>

        <div id="IconFrame">
              <h1>V</h1>
        </div>
      </div>
    );
  }
}


export default HomePage;
