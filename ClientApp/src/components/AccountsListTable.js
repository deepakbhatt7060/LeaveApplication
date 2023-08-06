import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AccountsListTable = () => {
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.loggedIn);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccountsList();
    },[]);
    const fetchAccountsList = () => {
        axios
            .get('/api/Signup/readAdmin')
            .then((response) => {
                setAccounts(response.data);
                setLoading(false); // Set loading to false when data is loaded
            })
            .catch((error) => {
                console.log('API error:', error);
                setLoading(false); // Set loading to false on error as well
            });
    };
   
    if (!isLoggedIn) {
        // If not logged in, navigate to home page
        navigate('/');
        return null;
    }

    const handleDeleteAccount = (accountid, name) => {
        var check = window.confirm(
            "Are you sure you want to delete this data with Id: " + accountid + " and name " + name
        );
        if (check === true) {
            axios
                .delete('/api/Signup/deleteAccount', {
                    data: accountid,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(() => {
                    fetchAccountsList();
                    toast.success("Deleted Data with name " + name);
                })
                .catch((error) => {
                    console.error('Delete error:', error.message);
                    if (error.response.status === 404) {
                        console.log('Data not found');
                    } else {
                        throw error;
                    }
                });
        }
    };

    return (
        <div>
            {loading ? ( // Display loading spinner while data is being fetched
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <Spinner color="primary" />
                </div>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Designation</th>
                            <th>Date of Joining</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id}>
                                <td>{account.employeeId}</td>
                                <td>{account.name}</td>
                                <td>{account.designation}</td>
                                <td>{account.dateofjoining}</td>
                                <td>
                                    <Button
                                        color="danger"
                                        onClick={(id, name) => handleDeleteAccount(account.id, account.name)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default AccountsListTable;
