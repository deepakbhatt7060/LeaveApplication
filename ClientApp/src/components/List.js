import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { Navigate } from 'react-router-dom';

const List = ({ email }) => {
    const [leaveData, setLeaveData] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = useSelector((state) => state.auth.loggedIn);

    useEffect(() => {
        fetchLeaveData();
    }, []);

    const fetchLeaveData = () => {
        axios
            .get('/api/Signup/read', { params: { email } })
            .then((response) => {
                setLeaveData(response.data); // Set the entire response.data in leaveData
                setLoading(false);
                console.log(leaveData);
            })
            .catch((error) => {
                console.log('API error:', error);
                setLoading(false);
            });
    };

    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            {loading ? (
                // Display loading spinner while data is being fetched
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <Spinner color="primary" />
                </div>
            ) : leaveData && leaveData.length > 0 ? (
                // Check if leaveData has been populated
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Leave Account</th>
                            <th>Leave Type</th>
                            <th>Leave Start Date</th>
                            <th>Leave End Date</th>
                            <th>Leave Count</th>
                            <th>Leave Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveData[0].leavesStatus.map((account, index) => ( 
                            <tr key={index}>
                                <td>{account.leaveAccount}</td>
                                <td>{account.leaveType}</td>
                                <td>{account.leaveStartDate}</td>
                                <td>{account.leaveEndDate}</td>
                                <td>{account.noOfDaysLeave}</td>
                                <td>{account.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                // Render a message when leaveData is empty or undefined
                <div>No leave data available</div>
            )}
        </div>
    );
};

export default List;
