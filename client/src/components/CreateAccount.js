import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../styles/Login.css';
import { AuthContext } from '../context.js';

class Login extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        // initialize username and password so form is controlled
        this.state =
        {
            email: '',
            username: '',
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
            body: JSON.stringify({ email: this.state.email, username: this.state.username, password: this.state.password })
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
                <h3>Please signup</h3>
                <Container className='loginContainer' fluid>
                    <div>
                        <Form className="loginForm" onSubmit={this.handleFormSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control required type="email" placeholder="Enter email" name="email" value={this.state.email} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control required type="username" placeholder="Enter username" name="username" value={this.state.username} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control required type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                            </Form.Group>
                            <Button variant="secondary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Container>
                <Button className="padTop" variant="secondary" href="/login">
                    Login
                </Button>
            </div>
        );
    }
};

export default Login;
