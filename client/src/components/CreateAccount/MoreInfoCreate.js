import React from 'react';
import { Form, Container } from 'react-bootstrap';
import './CreateAccount.css';
import { AuthContext } from '../../context.js';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Select from "react-select";
import { useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';



function paramChecker(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class MoreInfoCreate extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        // initialize username and password so form is controlled
        this.state =
        {
            entityType: 'selectAccountType',
            entityTypeName: 'select one',
            aboutMe: '', //contains petsArray (pet tags)
            pet: '',
            petsArray: [],
            ownerName: '',
            username: '',
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
            ],
            entityOptions: [
                {value: "selectAccountType", label: "select one"},
                {value: 'petOwner', label: 'pet owner'},
                {value: 'eventOrganizer', label: 'event organizer'},
                {value: 'shelterOrStore', label: 'pet shelter or store'},
            ]
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.multiPetSelectHandleOnChange = this.multiPetSelectHandleOnChange.bind(this);
    }

    componentDidMount() {
        let { id } = this.props.params;
        this.fetchData(id);
    }

    fetchData = id => {
        this.setState({username: id})
    };

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

    handleSubmit() {
        if (this.state.entityType == "petOwner") {
            this.state.aboutMe = "I am a proud pet owner!" + this.state.aboutMe;
        } else if (this.state.entityType == "eventOrganizer") {
            this.state.aboutMe = "I organize events!\nThe types of pets I host for are:\n" + this.state.aboutMe;
        } else if (this.state.entityType == "shelterOrStore") {
            this.state.aboutMe = "We offer pets!\nThe types of pets we have are:\n" + this.state.aboutMe;
        }

        fetch('/MoreInfoCreateUpdateProfile',
          {
            method: 'POST',
            headers: { "Content-Type": "application/json",
              'Accept': 'application/json'
            },
            body: JSON.stringify({ ownerName: this.state.ownerName, entityType: this.state.entityType,
                                aboutMe: this.state.aboutMe, username: this.state.username}),
          }) .then((response) => response.json())
  
          .then((result) => {
            console.log('Success:', result.loginStatus);
         })
         .catch((error) => {
           console.error('Error:', error);
         });
    }

    // handleSubmit() {
    //   var data = new FormData()
    //   data.append('ownerName', ownerName)
    //   data.append('entityType', entityType)
    //   data.append('aboutMe', aboutMe) //will contain petsArray
  
    //   fetch('/MoreInfoCreateUpdateProfile',
    //     {
    //       method: 'POST',
    //       body: data
    //     }).then((response) => response.json())
  
    //     .then((result) => {
    //        console.log('Success:', result.loginStatus);
    //     })
    //     .catch((error) => {
    //       console.error('Error:', error);
    //     });
    //   }

    entityHandleOnChange = (a) => {
        this.setState(state => {
            return {
              entityType: a.value,
              entityTypeName: a.label,
            };
          });    
        };

    petSelectHandleOnChange = (a) => {
        this.setState({pet: a.value});
    };

    multiPetSelectHandleOnChange(a) {
        this.setState(state => {
            return {
              petsArray: a,
              aboutMe: ""
            };
          });

        this.setState({
            aboutMe: this.state.aboutMe = ""
        });

        // add the pets to aboutme
        a.forEach(({value}) => this.setState({
            aboutMe: this.state.aboutMe += value + "\n"
        }));

        // var labels = a.map(obj => Object.keys(obj))
        // this.setState({
        //     // aboutMe: JSON.stringify({brug})
        //     aboutMe: brug
        // });
    }

    render() {
        const entityType = this.state.entityType;
        const disabledIf = (this.state.entityType == "petOwner" && (! this.state.ownerName)) ||
        (this.state.entityType == "eventOrganizer" && ((! this.state.ownerName) || (! this.state.petsArray.length))) ||
        (this.state.entityType == "shelterOrStore" && ((! this.state.ownerName) || (! this.state.petsArray.length))) ||
        (this.state.entityType == "selectAccountType")
        let createForm;
        if (entityType == "eventOrganizer") {
            createForm = <div classname="mt-4">
                                <Form.Group className="mb-3">
                                    <TextField id="outlined-basic"
                                    label="First and Last Name"
                                    name="ownerName"
                                    style={{zIndex:0}}
                                    value={this.state.ownerName} onChange={this.handleInputChange}/>
                                </Form.Group>
                                 <Container className='eventOrganizerPets' fluid>
                                <div style={{width: '600px'}}>
                                    <h>I plan to host events for</h>
                                    <div>
                                        <Select
                                        className="form-select"
                                        onChange={this.multiPetSelectHandleOnChange}
                                        value={this.state.petsArray}
                                        options={this.state.options}
                                        isMulti/>
                                    </div>
                                </div>
                            </Container>
                            </div>;
        } else if (entityType == "petOwner") {
            createForm = <div classname="mt-4">
                            <Form.Group className="mb-3">
                                <TextField id="outlined-basic"
                                    label="First and Last Name"
                                    name="ownerName"
                                    style={{zIndex:0}}
                                    value={this.state.ownerName} onChange={this.handleInputChange}/>
                            </Form.Group>
                            {/* <Form.Group className="mb-3">
                                <Form.Control required type="petName" placeholder="Pet Name" name="petName" value={this.state.petName} onChange={this.handleInputChange}/>
                            </Form.Group>
                            <Container className='petOwnerPet' fluid>
                                <div>
                                    <h>My pet is {(this.state.pet == "insect" || this.state.pet == "amphibian") ? "an" : "a"}</h>
                                    <Select className="form-select" onChange={this.petSelectHandleOnChange} options={this.state.options}/>
                                </div>
                            </Container> */}
                        </div>;
        } else if (entityType == "shelterOrStore") {
            createForm = <div classname="mt-4">
                            <Form.Group className="mb-3">
                                <TextField id="outlined-basic"
                                    label="Store or Shelter Name"
                                    name="ownerName"
                                    style={{zIndex:0}}
                                    value={this.state.ownerName} onChange={this.handleInputChange}/>
                            </Form.Group>
                            <Container className='shelterOrStorePets' fluid>
                                <div style={{width: '600px'}}>
                                    <h>We offer</h>
                                    <Select className="form-select" onChange={this.multiPetSelectHandleOnChange}
                                     value={this.state.petsArray} options={this.state.options} isMulti/>
                                </div>
                            </Container>
                        </div>;
        }

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}>
                <div className='login-background-frame'>
                    <h1>Tell us more about yourself</h1>
                    <Divider variant="middle" sx={{ m: -0.5, mb: 2 }}/>
                    <Container className='createAccountContainer' fluid>
                        <div>
                            <div className="mt-4" style={{width: '400px'}}>
                                <h>I am {this.state.entityType == "eventOrganizer" ? "an" : "a"} </h>
                                <Select className="form-select"
                                onChange={this.entityHandleOnChange}
                                value={{label: this.state.entityTypeName}}
                                options={this.state.entityOptions}/>
                            </div>
                        </div>
                    </Container>
                    <Divider variant="middle" sx={{ m: -0.5, mb: 2 }}/>
                    {createForm}
                    <Divider variant="middle" sx={{ m: -0.5, mb: 5 }}/>
                    <Button
                    variant="contained"
                    component={Link}
                    to="/"
                    disabled={disabledIf}
                    color="success"
                    size="large"
                    sx={{ fontWeight: 'bold' }}
                    onClick={this.handleSubmit}>
                        Let's Go
                    </Button>
                </div>
            </div>
        );
    }
};
export default paramChecker(MoreInfoCreate);
