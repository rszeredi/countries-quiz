import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './QuizMenu.css';

import quizzes from './QuizProps';

export default function QuizMenu() {
	const buildLinks = () => {
		let links = [];
		Object.keys(quizzes).forEach((category) => {
			links.push(
				<h2 key={category} className="QuizMenu-category-heading">
					{category}
				</h2>
			);
			const buttons = (
				<div className="QuizMenu-variant-buttons">
					{quizzes[category].map((quiz) => (
						<QuizLink
							route={'/' + quiz.route}
							key={quiz.route}
							quizLabelName={quiz.variant}
						/>
					))}
				</div>
			);
			links.push(buttons);
		});
		return links;
	};

	return (
		<div>
			<h1 className="QuizMenu">Choose a Quiz!</h1>
			<div className="QuizMenu-links">{buildLinks()}</div>
		</div>
	);
}

function QuizLink(props) {
	return (
		<Link className="QuizMenu-quiz-link" to={props.route}>
			{props.quizLabelName}
		</Link>
	);
}
