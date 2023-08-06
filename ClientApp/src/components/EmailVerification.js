import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { login } from './authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const EmailVerification = ({ email, otp, data ,autho}) => {
    const dispatch = useDispatch();
    const [ottp, setOtp] = useState(otp);
    const [enteredotp, setEnteredOtp] = useState('');
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const navigate = useNavigate();
    const handleOtpChange = (event) => {
        setEnteredOtp(event.target.value);
    };

    //verify otp and helps user logged in
    const verifyOtp = (e) => {
        e.preventDefault();
        if (ottp === enteredotp) {
            toast.success('Otp Verified Successfully');
            if (data === -1) {
                navigate('/Reset', { state: { email: email, autho:autho } });
            }
            else {
                toast.success("Successfully Logged In ");
                dispatch(login());
                navigate('/Admin', { state: { email: email } });
            }

        } else {
            alert('Wrong OTP entered');
        }
    };

    //Timer of 60 sec to resend the otp if not sent
    useEffect(() => {
        const timer = setTimeout(() => {
            setResendDisabled(false);
        }, 60000); 

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (resendDisabled) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [resendDisabled]);

    useEffect(() => {
        if (countdown === 0) {
            setResendDisabled(false);
        }
    }, [countdown]);

    //api to send the email using smtpconnectivity file
   const sendEmail = (ottp) => {
        const data = {
            otp: ottp,
            email: email,
        };
        axios
            .post('/api/Signup/smtp', data)
            .then((response) => {
                console.log('API response:', response.data);
                toast.success('Otp sent successfully');
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };

    //function to generate string otp of 6 digits 
    const generateOTP = () => {
        let otp = '';
        for (let i = 0; i < 6; i++) {
            otp += Math.floor(Math.random() * 10).toString();
        }
        return otp;
    }
        //handles onclick event to resend the otp
    const handleResendClick = () => {
        setResendDisabled(true);
        setCountdown(60);

        const generatedOtp = generateOTP();
        setOtp(generatedOtp);
        sendEmail(generatedOtp);

        const timer = setTimeout(() => {
            setResendDisabled(false);
        }, 60000); 

        return () => clearTimeout(timer);
    };

    return (
        <div className="containerreact" style={{ border: '2px solid black'}}>
            <Form onSubmit={verifyOtp}>
                <br />
                <br />
                <Form.Group>
                    <Form.Control type="text" placeholder="Enter OTP" style={{ textAlign: 'center' }} value={enteredotp} onChange={handleOtpChange} />
                </Form.Group>
                <br />
                <Button variant="primary" onClick={verifyOtp} style={{ width: '100%' }}>
                    Verify
                </Button>
                <br /><br />
                {countdown > 0 && (
                    <Button variant="secondary" style={{ width: '100%' }} disabled>
                        Resend OTP ({countdown}s)
                    </Button>
                )}
                {countdown === 0 && (
                    <Button variant="primary" style={{ width: '100%' }} onClick={handleResendClick} disabled={resendDisabled}>
                        Resend OTP
                    </Button>
                )}
                <br /><br />
            </Form>
        </div>
    );
};

export default EmailVerification;
