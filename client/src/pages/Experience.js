import * as React from "react"
import "../styles/Experience.css"
import PageTitle from "../components/PageTitle"
import Slider from "../components/Slider";


const WorkEntry = (props) =>
{
  return (
    <div id="WorkEntryFrame">
      <div id="WorkTitle">{props.WorkTitle}</div>
      <div id="WorkLocation">{props.WorkPlace} {props.WorkLocation}</div>
      <div id="WorkInfo">{props.WorkDate}</div>
      <div id="WorkDescription"><ul id="WorkUl">{
        props.WorkDescription.map((val) => <li >{val}</li>)
      }</ul></div>
    </div>
  );
}


class Experience extends React.Component
{

  constructor(props) {
    console.log("Constructor called!")
    super(props);
    this.state = {
      renderedResponse: ''
    };
  }

  getResponse = async() => {
    const response = await fetch('/api/ExperienceGetter');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  componentDidMount() {
    this.getResponse()
      .then(res => {
        const someData = res;
        console.log("Switchedddd")
        this.setState({ renderedResponse: someData });
      })
  }
  render() {
    return (
      <div id="ExperiencePage">
        <PageTitle text="Experience" />

        <div id="ExpFrameHolder">
          <div className="ItemFrame">
            <div id="FrameTitle">W O R K</div>
            <hr/>
            <WorkEntry WorkTitle="Gameplay Programmer" WorkPlace="Unlimited Projects Studios" WorkLocation="| Edmonton, Canada" WorkDate="March 2021 - July 2021" WorkDescription={["Was a gameplay programmer for Unlimited projects and worked on various gameplay aspects such as player stats, inventory, tools, etc.", " Worked on a large team with other programmers, 3D modelers, Artists, Animators, and Builders"]} />
            <WorkEntry WorkTitle="Freelance Developer" WorkPlace="Various Individuals/Groups/Studios" WorkLocation="" WorkDate="September 2020 - Present" WorkDescription={["I did freelance game development work (Lua, Roblox Engine). I worked as either a front-end, back-end, or full-stack devloper."]}  />

          </div>

          <div className="ItemFrame">
            <div id="FrameTitle">L A N G U A G E S</div>
            <hr/>
            <Slider SliderSize="70%" LanguageName="C++"/>
            <Slider SliderSize="80%" LanguageName="LUA"/>
            <Slider SliderSize="45%" LanguageName="Python"/>
            <Slider SliderSize="55%" LanguageName="JavaScript"/>
            <Slider SliderSize="50%" LanguageName="HTML"/>
            <Slider SliderSize="50%" LanguageName="CSS"/>
            <Slider SliderSize="45%" LanguageName="Shell/Bash"/>
            <Slider SliderSize="35%" LanguageName="Java"/>
          </div>

          <div id = "ToolFrame">
            <div id="FrameTitle">T O O L S</div>
            <hr/>
            <Slider SliderSize="55%" LanguageName="Terminal"/>
            <Slider SliderSize="45%" LanguageName="GIT"/>
            <Slider SliderSize="50%" LanguageName="React.js"/>
          </div>
        </div>

      </div>
    );
  }
}


export default Experience;
