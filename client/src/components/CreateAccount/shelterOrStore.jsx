import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const ShelterOrStore = () => {
    return (
    <div classname="mt-4">
        <Form.Group className="mb-3">
            <Form.Control required type="organizationName" placeholder="Name of Shelter or Store" name="organizationName"/>
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>We have...</Form.Label>
            <Form.Select id="createAccountFormSelect">
                <option>dogs</option>
                <option>cats</option>
                <option>birds</option>
                <option>other</option>
                <option>multiple types of animals</option>
            </Form.Select>
        </Form.Group>
    </div>
    );
};

export default ShelterOrStore;