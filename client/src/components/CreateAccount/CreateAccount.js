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
            username: '',
            firstName: '',
            lastName: '',
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
        event.preventDefault();
        // POST request using fetch with async/await
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.state.email, username: this.state.username, firstName: this.state.firstName,
                lastName: this.state.lastName, password: this.state.password })
        };
        const response = await fetch('http://localhost:4000/user/signup', requestOptions);
        const data = await response.json();
        console.log(data)

        if (data.errors || data.message) {
            // alert to error
            alert("Incorrect username or password.");
        }
        //auth token is saved as a cookie
        // if it was successful

        if (data.token) {
            // dispatch() from AuthContext with auth token from response
            console.log("Successful login...");
            this.context.dispatch({
                type: "LOGIN",
                payload: {
                    ...data,
                    email: this.state.email
                }
            });
        }

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
                        <Form className="createAccountForm" onSubmit={this.handleFormSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control required type="firstName" placeholder="First Name" name="firstName" value={this.state.firstName} onChange={this.handleInputChange} />
                                <Form.Control required type="lastName" placeholder="Last Name" name="lastName" value={this.state.lastName} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control required type="username" placeholder="Enter username" name="username" value={this.state.username} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control required type="email" placeholder="Enter email" name="email" value={this.state.email} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control required type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Link to="/MoreInfoCreate">
                                <Button variant="secondary" type="submit">
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
