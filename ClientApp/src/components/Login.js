import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './Login.css';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { login } from './authSlice';
import {useDispatch } from 'react-redux';
import EmailVerification from './EmailVerification';

const Login = () => {
   
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const [matched, setmatched] = useState();
    const [matchedautho, setmatchedautho] = useState('');
    const [state, setState] = useState({
        email: '',
        password: '',
        formfilled: false,
        emailcorrect: false,
        passwordcorrect: false,
    });

    const generateOTP = () => {
        let otp = '';
        for (let i = 0; i < 6; i++) {
            otp += Math.floor(Math.random() * 10).toString();
        }
        return otp;
    };

    const sendEmail = (ottp) => {
        const data = {
            otp: ottp,
            email: state.email,
        };
        axios
            .post('/api/Signup/smtp', data)
            .then((response) => {
                console.log('API response:', response.data);
               
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { email, password } = state;
          axios
                .get('/api/Signup/reading', { params: { email, password } })
                .then(response => {
                    const data = response.data;
                    const matchedDocument = data.find(doc => doc.emailId === email && doc.password === password);
                    setmatched(matchedDocument.login);
                    setmatchedautho(matchedDocument.authority);
                    if (matchedDocument.authority === "admin") {
                        var otpcheck = generateOTP();
                        setOtp(otpcheck);
                        sendEmail(otpcheck);
                        setShowEmailVerification(true);
                        
                    }
                    else if (matchedDocument.login === -1 && (matchedDocument.authority === "manager" || matchedDocument.authority === "employee"))
                    {
                         navigate('/Reset', { state: { email: email, autho: matchedDocument.authority} });
                    }
                    else if ((matchedDocument.authority === "manager" || matchedDocument.authority === "employee") && matchedDocument.login !== -1)
                    {
                         toast.success("successfully logged in");
                         dispatch(login());
                         navigate('/Main', { state: { email: email, autho: matchedDocument.authority} });
                     }
                    else {
                          alert('Invalid credentials. Please try again.');
                         }
                })
                .catch((error) => {
                    console.error('API error:', error);
                });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState((prevState) => {
            const updatedState = {
                ...prevState,
                [name]: value,
            };
            const { email, password} = updatedState;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^[a-zA-Z0-9]{8,}$/;
            updatedState.emailcorrect = emailRegex.test(email);
            updatedState.passwordcorrect = passwordRegex.test(password);
            updatedState.formfilled =
                emailRegex.test(email) &&
                passwordRegex.test(password);

            return updatedState;
        });
    };
    const { formfilled, emailcorrect, passwordcorrect } = state;
    const containerClassName = `${formfilled ? 'filled' : 'empty'}`;
    const emailValidationClass =`${emailcorrect ? 'correct' : 'wrong'}`;
    const passwordValidationClass = `${passwordcorrect ? 'correct' : 'wrong'}`;

    return (
        showEmailVerification ? (
            <EmailVerification email={state.email} otp={otp} data={matched} autho={matchedautho} />
        ) : (
        <React.Fragment>
            <div className={'containerreact ' + containerClassName}>
                <Form onSubmit={handleSubmit}><br />
                    <span id="formhead">Login</span><br /><br />
                    <Form.Group controlId="formEmail" className="row align-items-center">
                        <Form.Label className="custom-label" column sm={2}>Email</Form.Label>
                        <div className="col-sm-10">
                            <Form.Control
                                className={`custom-input ${emailValidationClass}`}
                                type="email"
                                placeholder="Enter Your Email"
                                value={state.email}
                                name="email"
                                autoComplete="email"
                                onChange={handleInputChange}
                            />
                        </div>
                    </Form.Group><br />
                    <Form.Group controlId="formPassword" className="row align-items-center">
                        <Form.Label className="custom-label" column sm={2}>Password</Form.Label>
                        <div className="col-sm-10">
                            <Form.Control
                                type="password"
                                className={`custom-input ${passwordValidationClass}`}
                                placeholder="Enter Your Password"
                                name="password"
                                autoComplete="off"
                                value={state.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Form.Group>
                    <br />
                    <Button type="submit" disabled={!state.formfilled}>
                        Login
                    </Button><br /><br /><br />
                </Form>
            </div>
                </React.Fragment>
        )
    );
};

export default Login;

