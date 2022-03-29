import React from 'react';
import { Link } from 'react-router-dom';
import './QuizPage.css';

export default function QuizPage(props) {
	const { quizProps } = props;
	const baseRoute = quizProps.makeQuizRouteString();
	return (
		<div className="QuizPage">
			<h1>{quizProps.title}</h1>
			<div className="Quiz-back-button">
				<Link to={quizProps.makeCategoryRouteString()}>
					<i className="fa fa-thin fa-arrow-left" /> Back to quiz menu
				</Link>
			</div>
			<div className="QuizPage-mode-btns-holder">
				<Link className="btn-contents QuizPage-mode-link" to={baseRoute + '/quiz'}>
					Quiz
					<div className="QuizPage-mode-link-emoji">🧐</div>
				</Link>

				<Link className="btn-contents QuizPage-mode-link" to={baseRoute + '/study'}>
					Study
					<div className="QuizPage-mode-link-emoji">🤓</div>
				</Link>
			</div>
		</div>
	);
}
