import * as React from 'react';
import "../styles/MenuBar.css"

import { Link as RouterLink } from 'react-router-dom';

import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';

const RightIconTable = {
  "/AboutMe":  <PersonRoundedIcon />,
  "/Experience": <EmojiEventsRoundedIcon />,
  "/Login": <SchoolRoundedIcon />,
  /*"/ContactMe": <EmailRoundedIcon />*/
}
const iconButtonStyle = {
  color: "#F0F0F0",
  "&:hover": {
    color: "#F0F0F0",
    backgroundColor: "#303030"
  },
};

const MenuBar = () => {
  const [open, setOpen] = React.useState(false);

  const projectsClick = () => {
    setOpen(!open);
  };

  const closeProjects = () => {
    setOpen(false);
  }
  return (
    <div>
      <div id="MenuBar">
        <div id="HomeButton">
            <Tooltip
            title="Home"
            followCursor
            placement='bottom-start'>
              <IconButton
                onClick={closeProjects}
                component={RouterLink} to="/"
                variant="plain"
                sx={iconButtonStyle}
                size="lg">
                <HomeRoundedIcon />
              </IconButton>
            </Tooltip>
        </div>

        <div id="RightIcons">

        <Tooltip
          title="Projects"
          followCursor
          placement='bottom-start'>
          <IconButton
              onClick={projectsClick}
               variant="plain"
               sx={iconButtonStyle}
               size="lg">
               <LightbulbIcon />
           </IconButton>
        </Tooltip>

        {
          Object.entries(RightIconTable)
           .map( ([key, value]) =>
           ( <Tooltip
             title={(key.replace("/", "")).replace(/([A-Z])/g, ' $1').trim()}
             followCursor
             placement='bottom-start'>
                <IconButton
                  onClick={closeProjects}
                  component={RouterLink} to={key}
                  variant="plain"
                  sx={iconButtonStyle}
                  size="lg"> {value}
                </IconButton>
              </Tooltip>))
         }

        </div>
      </div>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List
            id="MenuList"
            component="div"
            disablePadding>
            <ListItemButton
            component={RouterLink} to={"/LuaProjects"}>
                <ListItemText disableTypography primary="Lua Projects" />
            </ListItemButton>
            <ListItemButton
            component={RouterLink} to={"/DataVisualizer"}>
                <ListItemText disableTypography primary="Datastrucure Visualizer" />
            </ListItemButton>
            <ListItemButton
            component={RouterLink} to={"/PathVisualizer"}>
                <ListItemText disableTypography primary="Pathfinding Visualizer" />
            </ListItemButton>
          </List>
        </Collapse>
      </div>
  );
}

export default MenuBar;
