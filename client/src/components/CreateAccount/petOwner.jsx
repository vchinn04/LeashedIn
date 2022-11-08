import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const PetOwner = () => {
    return (
    <div classname="mt-4">
        <Form.Group className="mb-3">
            <Form.Control required type="petName" placeholder="Pet Name" name="petName"/>
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>My pet is a...</Form.Label>
            <Form.Select id="createAccountFormSelect">
                <option>dog</option>
                <option>cat</option>
                <option>bird</option>
                <option>other</option>
            </Form.Select>
        </Form.Group>
    </div>

    );
};

export default PetOwner;