import React from 'react'

import "../styles/PageTitle.css"

const PageTitle = (props) =>
{
  return (
    <div id="TitleFrame">
      <h1 id="TitleText">{props.text}</h1>
      <hr id="TitleLine"/>
    </div>
  );
}

export default PageTitle
