import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../Login/Login.css';
import './CreateAccount.css';
import { AuthContext } from '../../context.js';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Select from "react-select";

class MoreInfoCreate extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        // initialize username and password so form is controlled
        this.state =
        {
            value: 'selectAccountType',
            pet: '',
            petsArray: [],
            petName: '',
            organizationName: '',
            options: [
                {value: 'amphibian', label: 'amphibian'},
                {value: 'cat', label: 'cat'},
                {value: 'dog', label: 'dog'},
                {value: 'bird', label: 'bird'},
                {value: 'ferret', label: 'ferret'},
                {value: 'fish', label: 'fish'},
                {value: 'guineaPig', label: 'guinea pig'},
                {value: 'horse', label: 'horse'},
                {value: 'insect', label: 'insect'},
                {value: 'lizard', label: 'lizard'},
                {value: 'rabbit', label: 'rabbit'},
                {value: 'turtle', label: 'turtle'}
            ]

        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.multiPetSelectHandleOnChange = this.multiPetSelectHandleOnChange.bind(this);
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

    petSelectHandleOnChange = (a) => {
        this.setState({pet: a.value});
    };

    multiPetSelectHandleOnChange(a) {
        this.setState(state => {
            return {
              petsArray: a
            };
          });
    }

    render() {
        const value = this.state.value;
        let createForm;
        if (value == "eventOrganizer") {
            createForm = <div classname="mt-4">
                                 <Container className='eventOrganizerPets' fluid>
                                <div>
                                    <h>I plan to host events for</h>
                                    <div>
                                        <Select className="form-select" onChange={this.multiPetSelectHandleOnChange}
                                         value={this.state.petsArray} options={this.state.options} isMulti/>
                                    </div>
                                </div>
                            </Container>
                            </div>;
        } else if (value == "petOwner") {
            createForm = <div classname="mt-4">
                            <Form.Group className="mb-3">
                                <Form.Control required type="petName" placeholder="Pet Name" name="petName" value={this.state.petName} onChange={this.handleInputChange}/>
                            </Form.Group>
                            <Container className='petOwnerPet' fluid>
                                <div>
                                    <h>My pet is {(this.state.pet == "insect" || this.state.pet == "amphibian") ? "an" : "a"}</h>
                                    <Select className="form-select" onChange={this.petSelectHandleOnChange} options={this.state.options}/>
                                </div>
                            </Container>
                        </div>;
        } else if (value == "shelterOrStore") {
            createForm = <div classname="mt-4">
                            <Form.Group className="mb-3">
                                <Form.Control required type="organizationName" placeholder="Name of Shelter or Store" name="organizationName"
                                 value={this.state.organizationName} onChange={this.handleInputChange}/>
                            </Form.Group>
                            <Container className='shelterOrStorePets' fluid>
                                <div>
                                    <h>We offer</h>
                                    <Select className="form-select" onChange={this.multiPetSelectHandleOnChange}
                                     value={this.state.petsArray} options={this.state.options} isMulti/>
                                </div>
                            </Container>
                        </div>;
        }
    
        return (
            <div className='loginContainer'>
                <h1>Tell us more about yourself</h1>
                <Container className='createAccountContainer' fluid>
                    <div>
                        <div className="mt-4">
                            <h>I am {this.state.value == "eventOrganizer" ? "an" : "a"} </h>
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
                <Link to="/">
                    <Button type="button" disabled={(this.state.value == "petOwner" && ((! this.state.petName) || (! this.state.pet))) ||
                                                    (this.state.value == "eventOrganizer" && (! this.state.petsArray.length)) || 
                                                    (this.state.value == "shelterOrStore" && ((! this.state.organizationName) || (! this.state.petsArray.length))) ||
                                                    (this.state.value == "selectAccountType")}>
                        Let's Go
                    </Button>
                </Link>
            </div>
        );
    }
};

export default MoreInfoCreate;

