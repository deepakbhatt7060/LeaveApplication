import React, { useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import './NavMenu.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './authSlice';

const NavMenu = () => {
    const [collapsed, setCollapsed] = useState(true);
    const isLoggedIn = useSelector((state) => state.auth.loggedIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    const handleLoginLogout = () => {
        if (isLoggedIn) {
            dispatch(logout());
        }
        navigate('/');
    };

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" container light>
                <NavbarBrand>Leave Application</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            {isLoggedIn ? (
                                <Link to="/" className="text-light" onClick={() => handleLoginLogout()}>
                                    Logout
                                </Link>
                            ) : (
                                <>
                                    <Link to="/Login" className="text-light" onClick={() => handleLoginLogout()}>
                                        Login
                                    </Link>
                                </>
                            )}
                        </NavItem>
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
};

export default NavMenu;
