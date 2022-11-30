import React, { useState, useEffect } from "react";
import { Avatar, Tooltip, Paper, Divider } from "@material-ui/core";
import { Scrollbars } from "react-custom-scrollbars";
import SearchIcon from "@material-ui/icons/Search";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import NavBar from "../NavBar/NavBar.js";
import Style from "./Style";
import axios from "axios";

const Followings = () => {
    const classes = Style();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.get("https://breakingbadapi.com/api/characters");
            //Breaking Bad character as filler
            setUsers(response.data);
        };
        fetchUsers();
    }, []);

    return (
        <Paper elevation={0} className={classes.followings}>
            <Scrollbars autoHide autoHideDuration={200}>
                <Divider />
                <div className={classes.followings__tab}>
                    <h4>Your Pages</h4>
                    <MoreHorizIcon />
                </div>
                <Divider />
                <div className={classes.followings__tab}>
                    <h4>Followings</h4>
                    <SearchIcon />
                    <MoreHorizIcon />
                </div>
                {users.map(({ char_id, name, img }) => (
                    <NavBar
                        key={char_id}
                        Source={
                            <Tooltip placement="left" title={name} arrow>
                                <Avatar src={img} size={100} />
                            </Tooltip>
                        }
                        title={name}
                        online={true}
                        lastSeen={
                            Math.floor(Math.random() * (3 - 1 + 1)) + 1 === 2 &&
                            `${Math.floor(Math.random() * 10) + 1} h`
                        }
                        noTransform={true}
                    />
                ))}
            </Scrollbars>
        </Paper>
    );
};

export default Followings;