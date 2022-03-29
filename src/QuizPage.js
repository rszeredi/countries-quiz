import React from 'react';
import { Link } from 'react-router-dom';

import {
	getQuestionsWithIncorrectCounts,
	INCORRECT_COUNTER_LOCAL_STORAGE_KEY
} from './quizHelpers';
import QuestionHistorySummary from './QuestionHistorySummary';

import './QuizPage.css';

export default function QuizPage(props) {
	const { quizProps } = props;
	const { quizId } = quizProps;
	const baseRoute = quizProps.makeQuizRouteString();

	const incorrectCounterThisQuiz = getQuestionsWithIncorrectCounts(
		INCORRECT_COUNTER_LOCAL_STORAGE_KEY
	)[quizId];

	return (
		<div className="QuizPage">
			<div className="Quiz-back-button">
				<Link to={quizProps.makeCategoryRouteString()}>
					<i className="fa fa-thin fa-arrow-left" /> Back to quiz menu
				</Link>
			</div>
			<h1>{quizProps.title}</h1>
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
			<div className="QuizPage-question-history">
				<QuestionHistorySummary
					title="Check out the questions you've missed"
					incorrectCounterThisQuiz={incorrectCounterThisQuiz}
					quizId={quizId}
				/>
			</div>
		</div>
	);
}
