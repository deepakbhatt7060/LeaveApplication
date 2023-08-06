import React, {useState} from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import Home from './Home';
import List from './List';
import { useSelector } from 'react-redux';
import { useLocation,Navigate } from 'react-router-dom';

const Main = () => {
    const location = useLocation();
    const authority = location.state?.autho;
    const email = location.state?.email;
    const isLoggedIn = useSelector((state) => state.auth.loggedIn);
    const [state, setState] = useState({
        showApplyLeave: false,
        showLeaveRequest: false,
        showApprovalRequest: false,
    });

    //if user is not logged in redirect to login page
    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    //changing the values on button click
    const applyLeave = () => {
        setState({
            showApplyLeave: true,
            showLeaveRequest: false,
            showApprovalRequest: false,
        })
    }
    const leaveRequest = () => {
        setState({
            showApplyLeave: false,
            showLeaveRequest: true,
            showApprovalRequest: false,
        })
    }
    const approvalRequest = () => {
        setState({
            showApplyLeave: false,
            showLeaveRequest: false,
            showApprovalRequest: true,
        })
    }
    return (
        <div className="container">
        <ButtonGroup style={{ width: '100%' }}>
                <Button onClick={applyLeave} style={{ flex: 1, backgroundColor: state.showApplyLeave ? 'hsl(262, 51%, 16%)' : '' }}>
                    Apply Leave
                </Button>
                <Button onClick={leaveRequest} style={{ flex: 1, backgroundColor: state.showLeaveRequest ? 'hsl(262, 51%, 16%)' : '' }}>
                    Leave Requests
                </Button>
                { authority==="manager" &&
                    <Button onClick={approvalRequest} style={{ flex: 1, backgroundColor: state.showApprovalRequest ? 'hsl(262, 51%, 16%)' : '' }}>
                        Approval Requests
                    </Button>}
            </ButtonGroup><br /><br />
            {state.showApplyLeave && <Home />}
            {state.showLeaveRequest && <List email={ email} />}

            <br/>
            </div>
    );
};

export default Main;
