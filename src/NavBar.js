import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
	return (
		<div className="NavBar">
			<ul className="NavBar-items">
				<Link to="/" className="NavBar-item">
					<li>Home</li>
				</Link>
			</ul>
		</div>
	);
}
