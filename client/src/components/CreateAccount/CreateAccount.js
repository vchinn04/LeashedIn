import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../Login/Login.css';
import './CreateAccount.css';
import { AuthContext } from '../../context.js';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';



class CreateAccount extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        // initialize username and password so form is controlled
        this.state =
        {
            email: '',
            displayName: '',
            password: ''
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
        console.log(this.state.email)
        console.log(this.state.password)
        console.log(this.state.displayName)
  
        fetch('/UserCreateAccount',
          {
            method: 'POST',
            headers: { "Content-Type": "application/json",
              'Accept': 'application/json'
            },
            body: JSON.stringify({ email: this.state.email, password: this.state.password,
                                displayName: this.state.displayName }),
          }) .then((response) => response.json())
  
          .then((result) => {
            console.log('Success:', result.loginStatus);
            if (!result.loginStatus)
            {
  
            }
            else {
            //  switchToMainPage()
             console.log(this.props)
              this.props.setLoginState(true)
            }
          })
          .catch((error) => {
            console.log("Noo")
            console.error('Error:', error);
          });
      }


    render() {
        // mostly copied from react-bootstrap page examples
        // https://react-bootstrap.github.io/forms/overview/
        // slightly changed some css and centered it
        return (
            <div className='loginContainer'>
                <h1>Sign Up</h1>
                <h2>Join the petwork</h2>
                <Container className='createAccountContainer' fluid>
                    <div>
                        <Form className="createAccountForm">
                            <Form.Group className="mb-3">
                                <Form.Control required type="displayName" placeholder="Display Name" name="displayName" value={this.state.displayName} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control required type="email" placeholder="Email" name="email" value={this.state.email} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control required type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Link to="/MoreInfoCreate">
                                <Button type="button" disabled={(!this.state.email) || (!this.state.displayName) || (!this.state.password)} onClick={this.handleFormSubmit}>
                                    Sign Up
                                </Button>
                            </Link>
                        </Form>
                    </div>
                </Container>

                <Link to="/">
                    <Button className="padTop" variant="secondary">
                        Go back to login
                    </Button>
                </Link>
            </div>
        );
    }
};

export default CreateAccount;
