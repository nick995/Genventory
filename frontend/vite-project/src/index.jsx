import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';


import Header from './components/header';
// import Register from './components/register';

// import Footer from './components/footer';
import Login from './components/login';
import Logout from './components/logout';

const routing = (
	<Router>
		<React.StrictMode>
			<Header />
			<Switch>
				<Route exact path="/" element={App} />
				<Route path="/register" element={Register} />

				<Route path="/login" element={Login} />
				<Route path="/logout" element={Logout} />
			</Switch>
			{/* <Footer /> */}
		</React.StrictMode>
	</Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();