import React from 'react'
import "../styles/Slider.css"
const Slider = (props) =>
{
  return (
    <div id="SliderFrame">
      <div id="SliderBackground" className="fade"><div className="SliderBody fade" style={{width:  `${props.SliderSize}`}}><div id="SliderText">{props.LanguageName}<div id="SliderCircle"></div></div></div></div>

      <div id="ExperienceMarkers" className="fade">
        <div id="MarkerFrame" className="Knowledgable">
          <div id="Marker"></div>
          <div id="MarkerText">KNOWLEDGABLE</div>
        </div>

        <div id="MarkerFrame" className="Experienced">
          <div id="Marker"></div>
          <div id="MarkerText">EXPERIENCED</div>
        </div>

        <div id="MarkerFrame" className="Expert">
          <div id="Marker"></div>
          <div id="MarkerText">EXPERT</div>
        </div>
      </div>
    </div>
  );
}

export default Slider;
