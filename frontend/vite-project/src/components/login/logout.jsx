import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function SignUp() {
	const navigate = useNavigate();
	const { logout } = useContext(AuthContext);

	useEffect(() => {
		const response = axiosInstance.post('user/logout/blacklist/', {
			refresh_token: localStorage.getItem('refresh_token'),
		});
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('user')
		axiosInstance.defaults.headers['Authorization'] = null;
		logout().then(() => {navigate('/login')});
	});
	return <div>Logout</div>;
}