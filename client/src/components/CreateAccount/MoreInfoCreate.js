import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../Login/Login.css';
import './CreateAccount.css';
import { AuthContext } from '../../context.js';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Select from "react-select";
import { useParams } from "react-router-dom";

function withParams(Component) {
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
        this.setState({entityType: a.target.value});
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
        const entityType = this.state.entityType;
        // const { id } = useParams();
        // this.setState({username: id});
        let createForm;
        console.log("THIS IS IT");
        if (entityType == "eventOrganizer") {
            createForm = <div classname="mt-4">
                                <Form.Group className="mb-3">
                                    <Form.Control required type="ownerName" placeholder="Your First and Last Name" name="ownerName"
                                    value={this.state.ownerName} onChange={this.handleInputChange}/>
                                </Form.Group>
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
        } else if (entityType == "petOwner") {
            createForm = <div classname="mt-4">
                            <Form.Group className="mb-3">
                                <Form.Control required type="ownerName" placeholder="Your First and Last Name" name="ownerName"
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
                                <Form.Control required type="ownerName" placeholder="Name of Shelter or Store" name="ownerName"
                                 value={this.state.ownerName} onChange={this.handleInputChange}/>
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
                            <h>I am {this.state.entityType == "eventOrganizer" ? "an" : "a"} </h>
                            <select className="form-select" onChange={this.entityHandleOnChange} entityHandleOnChange={this.state.entityType}>
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
                    <Button type="button" disabled={(this.state.entityType == "petOwner" && (! this.state.ownerName)) ||
                                                    (this.state.entityType == "eventOrganizer" && ((! this.state.ownerName) || (! this.state.petsArray.length))) ||
                                                    (this.state.entityType == "shelterOrStore" && ((! this.state.ownerName) || (! this.state.petsArray.length))) ||
                                                    (this.state.entityType == "selectAccountType")} onClick={this.handleSubmit}>
                        Let's Go
                    </Button>
                </Link>
            </div>
        );
    }
};

export default withParams(MoreInfoCreate);
