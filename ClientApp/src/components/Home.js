import { Table, Form, Row, Col, Button } from 'react-bootstrap';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';

const Home = () => {
   
    const location = useLocation();
    const emailid = location.state?.email;
    const isLoggedIn = useSelector((state) => state.auth.loggedIn);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [leaveType, setLeaveType] = useState('fullDay');
    const [leaveAccount, setLeaveAccount] = useState(null);
    const [leaveHalf, setLeaveHalf] = useState('firstHalf');
    const [data, setData] = useState(null);
    const [options, setoptions] = useState(null);
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchData(emailid);
    },[]);
    const fetchData = (email) => {
        axios
            .get('/api/Signup/read', { params: { email } })
            .then(response => {
                setData(response.data);
                setoptions( [
                    { value: response.data[0].leavesAvailable.personalLeaves, label: 'Personal Leave' },
                    { value: response.data[0].leavesAvailable.optionalLeaves, label: 'Optional Leave'},
                    { value: response.data[0].leavesAvailable.sickLeaves, label: 'Sick Leave' },
                    { value: response.data[0].leavesAvailable.maternityLeaves, label: 'Maternity Leave' },
                    { value: response.data[0].leavesAvailable.paternityLeaves, label: 'paternity Leave' },
                    { value: response.data[0].leavesAvailable.birthdayLeaves, label: 'Birthday Leave' },
                    { value: response.data[0].leavesAvailable.weddingLeaves, label: 'Wedding Leave' },
                    { value: response.data[0].leavesAvailable.compassionateLeaves, label: 'Compassionate Leave' },
                    { value: response.data[0].leavesAvailable.covidLeaves, label: 'Covid Leave' },
                    { value: response.data[0].leavesAvailable.annualLeaves, label: 'Annual Leave' },
                ]);

            })
            .catch(error => {
                console.error('API error:', error);
            });
    };
    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }
    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    };
    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 45);
        const year = maxDate.getFullYear();
        let month = maxDate.getMonth() + 1;
        let day = maxDate.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    };

    const handleStartDateChange = e => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = e => {
        setEndDate(e.target.value);
    };

    const handleEndDateFocus = e => {
        if (startDate) {
            e.target.min = startDate;
        }
    };
    const handleLeaveAccountChange = (selectedOption) => {
        if (selectedOption) {
            setLeaveAccount(selectedOption.label);// Store the selected option's value in the state
        } else {
            setLeaveAccount(null);
        }
    };
    const handleLeaveTypeChange = e => {
        setLeaveType(e.target.value);
        if (e.target.value === 'halfDay') {
            setEndDate(startDate); // Automatically set the end date to the start date when leave type is halfDay
        } else {
            setEndDate(''); // Reset the end date when leave type is fullDay
        }
    };

    const handleLeaveHalfChange = e => {
        setLeaveHalf(e.target.value);
    };

    const maxDate = getMaxDate();
    const currentDate = getCurrentDate();
    const formatOptionLabel = ({ label, value }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ textAlign: 'left' }}>{label}</span>
            <span style={{ textAlign: 'right', fontWeight: 'bold' }}>{value}</span>
        </div>
    );
    const handleSubmit = (e) => {
        e.preventDefault();

        const apiUrl = '/api/Signup/updateleave';

        const headers = {
            'Content-Type': 'application/json',
        };

        // Calculate the number of days between start and end dates
        const startDateObject = new Date(startDate);
        const endDateObject = new Date(endDate);
        const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
        const noOfDaysLeave = Math.round(Math.abs((endDateObject - startDateObject) / oneDay)) + 1;

        const leaveData = {
            leaveAccount: leaveAccount,
            leaveType:leaveType,
            leaveStartDate: startDateObject.toISOString(),
            leaveEndDate: endDateObject.toISOString(),
            noOfDaysLeave: noOfDaysLeave,
            status: 'Applied',
            description: description,
        };

        const requestData = {
            EmailId: emailid,
            LeaveData: leaveData,
        };

        axios
            .put(apiUrl, requestData, { headers })
            .then((response) => {
                console.log('Update successful', response.data);
                toast.success('Updated Data Successfully');
            })
            .catch((error) => {
                console.error('Update error:', error.message);
            });
    };

        const handleDescription = (e) => {
            setDescription(e.target.value);
        }

        return (

            <div>
                {data && (
                    <>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>Personal Leaves</th>
                                    <th>Optional Leaves</th>
                                    <th>Sick Leaves</th>
                                    <th>Total Leaves</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{data[0].leavesAvailable.personalLeaves}</td>
                                    <td>{data[0].leavesAvailable.optionalLeaves}</td>
                                    <td>{data[0].leavesAvailable.sickLeaves}</td>
                                    <td>{data[0].leavesAvailable.totalLeaves}</td>
                                </tr>
                            </tbody>
                        </Table>

                        <Form onSubmit={(e) => handleSubmit(e)}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="leaveType">
                                    <Form.Label>Acount Type</Form.Label>
                                    <Select
                                        value={options.find((option) => option.value === leaveAccount)}
                                        onChange={handleLeaveAccountChange}
                                        options={options}
                                        formatOptionLabel={formatOptionLabel} // Use the custom formatOptionLabel function
                                        isSearchable={false}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="leaveType">
                                    <Form.Label>Leave Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={leaveType}
                                        onChange={handleLeaveTypeChange}
                                    >
                                        <option value="fullDay">Full Day</option>
                                        <option value="halfDay">Half Day</option>
                                    </Form.Control>
                                </Form.Group>

                                {leaveType === 'halfDay' && (
                                    <Form.Group as={Col} controlId="leaveHalf">
                                        <Form.Label>Leave Half</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={leaveHalf}
                                            onChange={handleLeaveHalfChange}
                                        >
                                            <option value="firstHalf">First Half</option>
                                            <option value="secondHalf">Second Half</option>
                                        </Form.Control>
                                    </Form.Group>
                                )}

                                <Form.Group as={Col} controlId="startDate">
                                    <Form.Label>Leave Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        min={currentDate}
                                        max={maxDate}
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="endDate">
                                    <Form.Label>Leave End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        min={currentDate}
                                        max={maxDate}
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        onFocus={handleEndDateFocus}
                                        disabled={leaveType === "halfDay"}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" onChange={handleDescription} rows={3} />
                                </Form.Group>
                            </Row>

                            <Button variant="primary" type="submit">
                                Apply
                            </Button>
                        </Form>
                    </>
                )}
            </div>
        );
    };
export default Home;