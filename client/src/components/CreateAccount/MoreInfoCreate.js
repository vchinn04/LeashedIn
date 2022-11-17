import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../Login/Login.css';
import './CreateAccount.css';
import { AuthContext } from '../../context.js';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

class MoreInfoCreate extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        // initialize username and password so form is controlled
        this.state =
        {
            value: 'selectAccountType',
            displayName: '',

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
            body: JSON.stringify({ email: this.state.email, username: this.state.username,
                displayName: this.state.displayName, password: this.state.password })
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

    entityHandleOnChange = (a) => {
        this.setState({value: a.target.value});
    };

    render() {
        const value = this.state.value;
        let createForm;
        if (value == "eventOrganizer") {
            createForm = <div classname="mt-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>I plan to host events for...</Form.Label>
                                    <Form.Select id="createAccountFormSelect">
                                        <option value="amphibian">amphibians</option>
                                        <option value="cat">cats</option>
                                        <option value="dog">dogs</option>
                                        <option value="bird">birds</option>
                                        <option value="ferret">ferrets</option>
                                        <option value="fish">fish</option>
                                        <option value="guineaPig">guinea pigs</option>
                                        <option value="horse">horses</option>
                                        <option value="insect">insects</option>
                                        <option value="lizard">lizards</option>
                                        <option value="rabbit">rabbits</option>
                                        <option value="turtle">turtles</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>;
        } else if (value == "petOwner") {
            createForm = <div classname="mt-4">
                            <Form.Group className="mb-3">
                                <Form.Control required type="petName" placeholder="Pet Name" name="petName"/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>My pet is a...</Form.Label>
                                <Form.Select id="createAccountFormSelect">
                                    <option value="amphibian">amphibian</option>
                                    <option value="cat">cat</option>
                                    <option value="dog">dog</option>
                                    <option value="bird">bird</option>
                                    <option value="ferret">ferret</option>
                                    <option value="fish">fish</option>
                                    <option value="guineaPig">guinea pig</option>
                                    <option value="horse">horse</option>
                                    <option value="insect">insect</option>
                                    <option value="lizard">lizard</option>
                                    <option value="rabbit">rabbit</option>
                                    <option value="turtle">turtle</option>
                                </Form.Select>
                            </Form.Group>
                        </div>;
        } else if (value == "shelterOrStore") {
            createForm = <div classname="mt-4">
                            <Form.Group className="mb-3">
                                <Form.Control required type="organizationName" placeholder="Name of Shelter or Store" name="organizationName"/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>We have...</Form.Label>
                                <Form.Select id="createAccountFormSelect">
                                    <option value="amphibian">amphibians</option>
                                    <option value="cat">cats</option>
                                    <option value="dog">dogs</option>
                                    <option value="bird">birds</option>
                                    <option value="ferret">ferrets</option>
                                    <option value="fish">fish</option>
                                    <option value="guineaPig">guinea pigs</option>
                                    <option value="horse">horses</option>
                                    <option value="insect">insects</option>
                                    <option value="lizard">lizards</option>
                                    <option value="rabbit">rabbits</option>
                                    <option value="turtle">turtles</option>
                                </Form.Select>
                            </Form.Group>
                        </div>;
        }

    
        return (
            <div className='loginContainer'>
                <h1>Tell us more about yourself</h1>
                <Container className='createAccountContainer' fluid>
                    <div>
                        <div className="mt-4">
                            <h2>I am a...</h2>
                            <select className="form-select" onChange={this.entityHandleOnChange} value={this.state.value}>
                                <option value="selectAccountType">select one</option>
                                <option value="petOwner">pet owner</option>
                                <option value="eventOrganizer">event organizer</option>
                                <option value="shelterOrStore">pet shelter or store</option>
                            </select>
                        </div>
                    </div>
                </Container>
                {createForm}
            </div>
        );
    }
};

export default MoreInfoCreate;

