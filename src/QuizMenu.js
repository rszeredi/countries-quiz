import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './QuizMenu.css';

export default function QuizMenu() {
	return (
		<div>
			<h1 className="QuizMenu">Choose a Quiz!</h1>
			<div className="QuizMenu-links">
				<QuizLink route="capital-cities-europe" quizName="Capital Cities: Europe" />
				<QuizLink route="capital-cities-africa" quizName="Capital Cities: Africa" />
				<QuizLink route="capital-cities-asia" quizName="Capital Cities: Asia" />
			</div>
		</div>
	);
}

function QuizLink(props) {
	return (
		<Link className="QuizMenu-quiz-link" to={props.route}>
			{props.quizName}
		</Link>
	);
}
