import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const EventOrganizer = () => {
    return (
    <div classname="mt-4">
        <Form.Group className="mb-3">
            <Form.Label>I plan to host events for...</Form.Label>
            <Form.Select id="createAccountFormSelect">
                <option>dogs</option>
                <option>cats</option>
                <option>birds</option>
                <option>other</option>
                <option>multiple animals</option>
            </Form.Select>
        </Form.Group>
    </div>
    );
};

export default EventOrganizer;