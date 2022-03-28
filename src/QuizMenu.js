import React from 'react';
import { Link } from 'react-router-dom';

import './QuizMenu.css';
import './CommonStyles.css';

import quizzes from './QuizProps';

export default function QuizMenu() {
	const buildLinks = () => {
		let links = [];
		Object.keys(quizzes).forEach((category) => {
			links.push(
				<Link
					className="btn-contents QuizMenu-quiz-category-link"
					to={'/' + category.toLowerCase().replace(' ', '-')}
					key={category}
				>
					{category}
				</Link>
			);
			// const buttons = (
			// 	<div key={`buttons-${category}`} className="btn">
			// 		{quizzes[category].map((quiz) => (
			// 			<QuizLink quizProps={quiz} key={quiz.quizId} />
			// 		))}
			// 	</div>
			// );
			// links.push(buttons);
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

// function QuizLink(props) {
// 	const { quizProps } = props;
// 	return (
// 		<Link className="btn-contents" to={quizProps.makeQuizRouteString()}>
// 			{quizProps.variant}
// 		</Link>
// 	);
// }
