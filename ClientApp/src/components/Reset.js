import React, { useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from './authSlice';
import { toast } from 'react-toastify';

const Reset = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const authority = location.state?.autho;
    const [state, setState] = useState({
        password: '',
        repassword: '',

    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (state.password === state.repassword) {
            const apiUrl = '/api/Signup/update';

            const headers = {
                'Content-Type': 'application/json',
            };

            const requestData = {
                Password: state.password,
                EmailId: email,
            };

            axios
                .put(apiUrl, requestData, { headers })
                .then((response) => {
                    console.log('Update successful', response.data);
                    toast.success("Password successfully reset ");
                    toast.success("Successfully Logged In ");
                    dispatch(login());
                    if (authority === "admin") {
                        navigate('/Admin', { state: { email: email } });
                    }
                    else {
                        navigate('/Main', { state: { email: email, autho: authority } });
                    }
                })
                .catch((error) => {
                    console.error('Update error:', error.message);
                });
        }
        else {
            alert("Both passwords should match");
        }
    }

    return (
        <div className="containerreact" style={{ border: '2px solid black' }}>
            <Form onSubmit={handleSubmit}><br />
                <span id="formhead">Reset Password</span><br /><br />
                <Form.Group controlId="formPassword" className="row align-items-center">
                    <Form.Label className="custom-label" column sm={2}> New Password</Form.Label>
                    <div className="col-sm-10">
                        <Form.Control
                            className="custom-input"
                            type="password"
                            placeholder="Enter New Password"
                            autoComplete="off"
                            value={state.password}
                            name="password"
                            onChange={handleInputChange}
                        />
                    </div>
                </Form.Group><br />
                <Form.Group controlId="formRePassword" className="row align-items-center">
                    <Form.Label className="custom-label" column sm={2}>Re-Enter Password</Form.Label>
                    <div className="col-sm-10">
                        <Form.Control
                            type="password"
                            className="custom-input"
                            placeholder="Confirm Password"
                            name="repassword"
                            autoComplete="off"
                            value={state.repassword}
                            onChange={handleInputChange}
                        />
                    </div>
                </Form.Group>
                <br />
                <Button type="submit" >
                    Reset
                </Button><br /><br /><br />
            </Form>
        </div>
    );
};

export default Reset;
