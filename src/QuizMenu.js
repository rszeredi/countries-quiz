import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './QuizMenu.css';

import quizzes from './QuizProps';

export default function QuizMenu() {
	return (
		<div>
			<h1 className="QuizMenu">Choose a Quiz!</h1>
			<div className="QuizMenu-links">
				{quizzes.map((quiz) => <QuizLink route={'/' + quiz.route} quizName={quiz.title} />)}
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
