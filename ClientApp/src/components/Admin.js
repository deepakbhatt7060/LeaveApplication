import React, { useState } from 'react';
import { Button, ButtonGroup, Form, FormGroup, Input, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import managerlist from './managerlist.json';
import Jobprofiles from './Jobprofiles.json';
import AccountsListTable from './AccountsListTable.js';

const Admin = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.loggedIn);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showListTable, setShowListTable] = useState(false);
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        manager: '',
        designation: '',
        authority: '',
        employeeid:'',
        dateofjoining: null,
        formfilled: false,
        namecorrect: false,
        emailcorrect: false,
        passwordcorrect: false,
        repasswordcorrect: false,
        redirectotp: false,
    });
    if (!isLoggedIn) {
        // If not logged in, navigate to home page
        navigate('/');
        return null;
    } 

    const handleCreateAccount = () => {
        setShowListTable(false);
        setShowSignUp(true);
    };
    const handleListAccount = () => {
        setShowSignUp(false);
        setShowListTable(true);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState((prevState) => {
            const updatedState = {
                ...prevState,
                [name]: value,
            };
           /* const { emailid, password } = updatedState;
            var nameRegex = /^[a-zA-Z]+$/;
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var passwordRegex = /^[a-zA-Z0-9]{8,}$/;
            updatedState.namecorrect = nameRegex.test(updatedState.name);
            updatedState.emailcorrect = emailRegex.test(emailid);
            updatedState.passwordcorrect = passwordRegex.test(password);
            updatedState.formfilled =
                nameRegex.test(updatedState.name) &&
                emailRegex.test(emailid) &&
                passwordRegex.test(password);
                */
            return updatedState;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const manageremail = managerlist.find((manager) => manager.name === state.manager);
        const data = {
            employeeId: state.employeeid,
            name: state.name,
            emailId: state.email,
            password: state.password,
            designation: state.designation,
            Dateofjoining: state.dateofjoining,
            leavesAvailable: {
                personalLeaves: 0,
                optionalLeaves: 0,
                sickLeaves: 0,
                totalLeaves: 0,
                maternityLeaves: 0,
                paternityLeaves: 0,
                weddingLeaves: 0,
                birthdayLeaves: 0,
                compassionateLeaves: 0,
                covidLeaves: 0,
                compensatoryLeaves: 0,
            },
            leavesStatus: [],
            manager: state.manager,
            managerEmailId: manageremail.email,
            leaveApplied: '',
            leaveCount: 0,
            authority: state.authority,
            login: -1,
        };

        axios
            .post('/api/Signup/create', data)
            .then((response) => {
                console.log('API response:', response.data);
                toast.success('Successfully Created Account');
                setState((prevState) => ({
                    ...prevState,
                    name: '',
                    email: '',
                    password: '',
                    manager: '',
                    designation: '',
                    dateofjoining: null,
                }));
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
   
    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1; // Add 1 to the month since it's zero-based
        let day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    };

    const getMinDate = () => {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() - 10);
        const year = minDate.getFullYear();
        let month = minDate.getMonth() + 1; // Add 1 to the month since it's zero-based
        let day = minDate.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    };

    const mxDate = getCurrentDate();
    const mnDate = getMinDate();

   /* const { formfilled, emailcorrect, passwordcorrect, namecorrect, repasswordcorrect } = state;
    const containerClassName = formfilled ? 'filled' : 'empty';
    const emailCorrectClassName = emailcorrect ? 'correct' : 'wrong';
    const passwordCorrectClassName = passwordcorrect ? 'correct' : 'wrong';
    const nameCorrectClassName = namecorrect ? 'correct' : 'wrong';
    */

    return (
        <div className="container">
            <ButtonGroup style={{ width: '100%' }}>
                <Button onClick={handleCreateAccount} style={{ flex: 1, backgroundColor: showSignUp ? 'hsl(262, 51%, 16%)' : '' }}>
                    Create Account
                </Button>
                <Button onClick={handleListAccount} style={{ flex: 1, backgroundColor: showListTable ? 'hsl(262, 51%, 16%)' : '' }}>
                    Accounts List
                </Button>
                <Button tag={Link} to="/leaves-applied" style={{ flex: 1 }} disabled>
                    Leaves Applied
                </Button>
            </ButtonGroup>
            <br />
            <br />
            {showSignUp && (
                <div className="containerreact" style={{ width: '50%', top: '62%', border: '2px solid black' } }>

                    <Form onSubmit={(e)=>handleSubmit(e)}>
                        <br />
                        <span id="formhead">Create Account</span><br /><br />
                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <Label for="employeeName">Employee Name</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="employeeName"
                                        placeholder="Employee Name"
                                        value={state.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                   
                                </FormGroup>
                               

                                <FormGroup>
                                    <Label for="employeeDesignation">Employee Designation</Label>
                                    <Input
                                        type="select"
                                        name="designation"
                                        placeholder="Employee Designation"
                                        id="employeeDesignation"
                                        value={state.designation}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Designation</option>
                                        {Jobprofiles.map((profile) => (
                                            <option key={profile.title} value={profile.title}>
                                                {profile.title}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                               
                                 <FormGroup>
                                    <Label for="assignedManager">Assigned Manager</Label>
                                    <Input
                                        type="select"
                                        name="manager"
                                        id="assignedManager"
                                        placeholder="Select Assigned Manager"
                                        value={state.manager}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Authority</option>
                                        {managerlist.map((manager) => (
                                            <option key={manager.name} value={manager.name}>
                                                {manager.name}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="employeeid">Employee ID</Label>
                                    <Input
                                        type="text"
                                        name="employeeid"
                                        id="employeeid"
                                        placeholder="Create Employee ID"
                                        value={state.employeeid}
                                        onChange={handleInputChange}
                                        required
                                    />

                                </FormGroup>
                               

                               
                            </div>

                            <div className="col-md-6">
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Generate Email"
                                        id="email"
                                        value={state.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                  
                                </FormGroup>
                               
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Generate Password"
                                        id="password"
                                        value={state.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                   
                                </FormGroup>
                                
                                <FormGroup>
                                    <Label for="dateOfJoining">Date of Joining</Label>
                                    <Input
                                        type="date"
                                        name="dateofjoining"
                                        id="dateOfJoining"
                                        min={mnDate} // Set the minimum date to the calculated minimum date
                                        max={mxDate}
                                        value={state.dateofjoining}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="authority">Authority</Label>
                                    <Input
                                        type="select"
                                        name="authority"
                                        id="authority"
                                        value={state.authority}
                                        onChange={handleInputChange}
                                        required
                                    >
                                    <option value="">Select Manager</option>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                    </Input>
                                </FormGroup>
                               
                                
                                
                            </div>
                        </div>
                        
                        <Button type="submit" color="primary">Create Account</Button>
                        <br /> <br />
                    </Form>
                </div>
            )}
            {showListTable && <AccountsListTable />}
              </div>
            );
        
};

export default Admin;
