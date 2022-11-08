import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../Login/Login.css';
import './CreateAccount.css';
import { AuthContext } from '../../context.js';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PetOwner from './petOwner';
import EventOrganizer from './eventOrganizer';
import ShelterOrStore from './shelterOrStore';

export default function MoreInfoCreate() {
    const[accountType, setAccountType] = useState("selectAccountType");

    const[petOwnerContentVisible, setPetOwnerContentVisible] = useState(false);
    const[eventOrganizerContentVisible, setEventOrganizerContentVisible] = useState(false);
    const[shelterOrStoreContentVisible, setShelterOrStoreContentVisible] = useState(false);

    useEffect(() => {
        accountType === "petOwner" ? setPetOwnerContentVisible(true) : setPetOwnerContentVisible(false);
        accountType === "eventOrganizer" ? setEventOrganizerContentVisible(true) : setEventOrganizerContentVisible(false);
        accountType === "shelterOrStore" ? setShelterOrStoreContentVisible(true) : setShelterOrStoreContentVisible(false);
    }, [accountType]);

    const handleOnChange = (a) => {
        setAccountType(a.target.value);
    };

    const renderResult = () => {
        let result;
        accountType === "selectAccountType"
          ? (result = " new user")
          : (result = accountType);
        return result;
      };
    
    const printOut = () => {
        return <h1>hello</h1>;
    }

    return (
        <div className='loginContainer'>
            <h1>Tell us more about yourself {renderResult()}</h1>
                <Container className='createAccountContainer' fluid>
                    <div>
                        <div className="mt-4">
                            <h2>I am a...</h2>
                            <select className="form-select" value={accountType} onChange={handleOnChange}>
                                <option value="selectAccountType">select one</option>
                                <option value="petOwner">pet owner</option>
                                <option value="eventOrganizer">event organizer</option>
                                <option value="shelterOrStore">pet shelter or store</option>
                            </select>
                        </div>
                    </div>
                </Container>
            {petOwnerContentVisible && <PetOwner />}
            {eventOrganizerContentVisible && <EventOrganizer />}
            {shelterOrStoreContentVisible && <ShelterOrStore />}
        </div>
    );
};