import React, { useState } from 'react';
import axiosInstance from '../../axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./register.scss"

function Register() {
	return (
		<>
			<div className='loginPage'>
				<WelcomeContainer />
				<RegisterContainer />
			</div>
		</>
	);
}

/**  check error status */
const errorStatus = (status) => {
	let additionalMessage;

	if (status === 401) {
		additionalMessage = "Please check email and password.";
	} else if (status === 500) {
		additionalMessage = "Please check server status or contact with MinGyu.";
	} else if (status == 400) {
		additionalMessage = "Invalid format";
	} else {
		additionalMessage = "Unkown error contact with MinGyu"
	}
	return additionalMessage;
};

/** Notify error messagee to the user. */
const notify = (error) => {
	const additionalMessage = errorStatus(error.response.status);

	console.log({ additionalMessage });

	toast.error(`${error.message}: ${additionalMessage}`, {
		position: "bottom-center",
		autoClose: 4000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
		transition: Bounce,
	});
};

/** Welcome Sign for login page */
function WelcomeContainer() {
	return (
		<div className='header'> Join to Jorgensen lab</div>
	)
}

/** LoginContainer that contains inputs, sign in button, alert */

function RegisterContainer() { 

	const navigate = useNavigate();
	const initialFormData = Object.freeze({
		email: '',
		username: '',
		password: '',
	});

	const [formData, updateFormData] = useState(initialFormData);

	const handleChange = (e) => {
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
	
		axiosInstance
			.post(`user/create/`, {
				email: formData.email,
				user_name: formData.username,
				password: formData.password,
			}, {
				headers: { Authorization: null } // Remove Authorization header for signup
			})
			.then((res) => {
				navigate('/login'); 
			}).catch((error) => {
				notify(error);
			});
	};
	return (
		<div className="loginContainer">
			<form className='loginForm'>
				<input type="email"
					id="email"
					name="email"
					placeholder="Email Address"
					autoComplete="email"
					autoFocus
					onChange={handleChange}
					required />

				<input
					type="username"
					id="username"
					name="username"
					placeholder="username"
					autoComplete="current-username"
					onChange={handleChange}
					required
				/>

				<input
					type="password"
					id="password"
					name="password"
					placeholder="Password"
					autoComplete="current-password"
					onChange={handleChange}
					required
				/>

				<button
					type="submit"
					variant="contained"
					color="primary"
					onClick={handleSubmit}
				>
					Sign Up
				</button>
				<LoginContainer/>
			</form>

			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition:Bounce
				style={{ width: "100%" }}
			/>

		</div>
	)
}

function LoginContainer() {
	return (
		<div className='registerContainer'>
			<p> Already have an account?  </p>
			<NavLink to="/login">Go to Log in</NavLink>
		</div>
	)
}

export default Register;