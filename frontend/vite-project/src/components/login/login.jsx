import React, { useState, useContext } from 'react';
import axiosInstance from '../../axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../auth/AuthContext';

import "./login.scss"

function Login() {
	return (
		<>
			<div className='loginPage'>
				<WelcomeContainer />
				<LoginContainer />
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
		<div className='header'> Welcome to Jorgensen lab</div>
	)
}

/** LoginContainer that contains inputs, sign in button, alert */
function LoginContainer() {


	const [redirecting, setRedirecting] = useState(false); // Added state for redirecting
	const { login } = useContext(AuthContext);

	const navigate = useNavigate();
	const initialFormData = Object.freeze({
		email: '',
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
		axiosInstance
			.post(`token/`, {
				email: formData.email,
				password: formData.password,
			})
			.then((res) => {
				console.log(res)
				// console.log(JSON.parse(config.data) ),
				// console.log(JSON.parse(res.config.data).email),
				// localStorage.setItem('user', JSON.parse(res.config.data).email),
					localStorage.setItem('access_token', res.data.access),
					localStorage.setItem('refresh_token', res.data.refresh),
					axiosInstance.defaults.headers['Authorization'] = 'JWT ' +
					localStorage.getItem('access_token'),
					login(formData).then(() => { navigate('/dashboard')})
			}).catch((error) => {
				console.log('hi');
				console.log(error);
				notify(error); // Call notify function
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
					Sign In
				</button>

				<RegisterContainer />

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
	);
}

function RegisterContainer() {
	return (
		<div className='registerContainer'>
			<p> are you new here?  </p>
			<NavLink to="/register">Create an account</NavLink>
		</div>
	)
}

export default Login;