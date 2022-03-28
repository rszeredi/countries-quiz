import React from 'react';
import { Link } from 'react-router-dom';

import './QuizCategoryPage.css';

export default function QuizCategoryPage(props) {
	const { quizCategory, quizList } = props;

	const makeQuizLink = (quizProps) => {
		return (
			// key={quiz.quizId}
			<Link
				className="btn-contents QuizCategoryPage-quiz-link"
				to={quizProps.makeQuizRouteString()}
				key={quizProps.quizId}
			>
				{quizProps.variant}
			</Link>
		);
	};

	const buttons = (
		<div className="QuizCategoryPage-buttons">{quizList.map((quiz) => makeQuizLink(quiz))}</div>
	);

	return (
		<div className="QuizCategoryPage">
			<div className="QuizCategoryPage-back-button">
				<Link to="/">
					<i className="fa fa-thin fa-arrow-left" /> Back to quiz menu
				</Link>
			</div>
			<h1 className="QuizCategoryPage-category-heading">{quizCategory}</h1>
			<div className="QuizCategoryPage-links">{buttons}</div>
		</div>
	);
}

// function QuizLink(props) {
// 	const { quizProps } = props;
// }
