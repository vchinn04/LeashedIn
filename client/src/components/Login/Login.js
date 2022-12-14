import React from 'react';

import { Form, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import './Login.css';

import { AuthContext } from '../../context.js';

import { styled } from '@mui/material/styles';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { Link } from 'react-router-dom';



const ColorButton = styled(Button)(({ theme }) => ({ // Button with custom color
  backgroundColor: "#825DD7",
  '&:hover': {
    backgroundColor: "#7150BC",
  },
}));


class Login extends React.Component {
      static contextType = AuthContext;
      constructor(props) {
      super(props);
      // initialize username and password so form is controlled
      this.state =
      {
          username: '',
          password: '',
          incorrectEntry: false
      };

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    // neat trick to handle all changes to both forms
    // from React tutorial on forms
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async handleFormSubmit(event) {
      console.log(this.state.username)
      console.log(this.state.password)
      const loginURL = '/UserLogIn?' + new URLSearchParams({ username: this.state.username, password: this.state.password }).toString()

      fetch(loginURL).then((response) => response.json())
      .then((result) => {
        console.log('Success:', result.loginStatus);
        if (!result.loginStatus)
        {
          this.setState({
              incorrectEntry: true
          });
        }
        else {
          this.props.setLoginState(result.username)  // login the user (will switch them to homepage)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    }


    render() {
      // mostly copied from react-bootstrap page examples
      // https://react-bootstrap.github.io/forms/overview/
      // slightly changed some css and centered it

      // Changed to use MUI and Bootstrap together and added custom sx to mui buttons
        return (
            <div className='login-background-frame'>
                <h3>Please Log In</h3>

                <Divider variant="middle" sx={{ m: -0.5, mb: 1 }}/>

                <Container className='loginContainer' fluid>
                    <Form className="loginForm" onSubmit={this.handleFormSubmit}>
                          <TextField id="outlined-basic"
                             error={this.state.incorrectEntry}
                             name="username"
                             label="Username"
                             variant="outlined"
                             fullWidth
                             margin="normal"
                             InputProps={{
                                     startAdornment: (
                                       <InputAdornment position="start">
                                         <PersonIcon />
                                       </InputAdornment>
                                     ),
                             }}
                             value={this.state.username}
                             onChange={this.handleInputChange}
                          />

                          <TextField id="outlined-password-input"
                             error={this.state.incorrectEntry}
                             helperText={(this.state.incorrectEntry)? "Incorrect username or password!" : ""}
                             label="Password"
                             name="password"
                             fullWidth
                             type="password"
                             margin="normal"
                             InputProps={{
                                startAdornment: (
                                 <InputAdornment position="start">
                                     <KeyIcon />
                                 </InputAdornment>
                                ),
                             }}
                             value={this.state.password}
                             onChange={this.handleInputChange}
                          />

                          <ColorButton variant="contained" size="large" sx={{ width: 1, fontWeight: 'bold' }} onClick={this.handleFormSubmit}>
                              Log In
                          </ColorButton>
                        </Form>
                </Container>

                <Divider variant="middle" sx={{ m: 2 }}/>

                <Button variant="contained" color="success" size="large" sx={{ fontWeight: 'bold' }} component={Link} to="/CreateAccount">
                    Create Account
                </Button>
            </div>
        );
    }
};

export default Login;
