import * as React from "react"
import "../styles/Homepage.css"

class HomePage extends React.Component
{
  constructor(props) {
    console.log("Constructor homepage called!")

    super(props);
    this.state = {
      renderedResponse: ''
    };
  }

  /*
  componentDidMount() {
    var testinng = {
      dataKey: "quang",
      dataValue:
       {
        "money": 10,
        "status": "bo..."
      }
    }

    fetch('/PostTestEvent',
      {
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
  */

  render() {
    return (
      <div id="HomePageFrame">
      
      </div>
    );
  }
}


export default HomePage;
