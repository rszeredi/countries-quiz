import React from 'react';
import { Link } from 'react-router-dom';

import './QuizMenu.css';

import quizzes from './QuizProps';

export default function QuizMenu() {
	const buildLinks = () => {
		let links = [];
		Object.keys(quizzes).forEach((category) => {
			links.push(
				<h2 key={`h2-${category}`} className="QuizMenu-category-heading">
					{category}
				</h2>
			);
			const buttons = (
				<div key={`buttons-${category}`} className="QuizMenu-variant-buttons">
					{quizzes[category].map((quiz) => (
						<QuizLink
							quizId={quiz.quizId}
							key={quiz.quizId}
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
		<Link className="QuizMenu-quiz-link" to={'/' + props.quizId}>
			{props.quizLabelName}
		</Link>
	);
}
