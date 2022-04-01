import React from 'react';
import { Link } from 'react-router-dom';
import { resetQuestionsWithIncorrectCounts } from './quizHelpers';

import {
	getQuestionsWithIncorrectCounts,
	INCORRECT_COUNTER_LOCAL_STORAGE_KEY
} from './quizHelpers';
import QuestionHistorySummary from './QuestionHistorySummary';

import './QuizPage.css';
import ActionButton from './ActionButton';
import useLocalStorageState from './hooks/useLocalStorageState';
import ConfirmationModal from './ConfirmationModal';

export default function QuizPage(props) {
	const { quizProps } = props;
	const { quizId } = quizProps;
	const baseRoute = quizProps.makeQuizRouteString();

	const [ incorrectCounterState, setIncorrectCounterState ] = useLocalStorageState(
		INCORRECT_COUNTER_LOCAL_STORAGE_KEY,
		{}
	);
	const incorrectCounterThisQuiz = incorrectCounterState[quizId];
	console.log('incorrectCounterThisQuiz', incorrectCounterThisQuiz);

	const resetIncorrectCounts = () => {
		const incorrectCounter = getQuestionsWithIncorrectCounts(
			INCORRECT_COUNTER_LOCAL_STORAGE_KEY
		);
		const { [quizId]: omitted, ...newIncorrectCounter } = incorrectCounter;
		setIncorrectCounterState(newIncorrectCounter);
	};

	const resetButton = (
		<ActionButton
			btnContent="Reset History"
			extraClassNames="QuizPage-question-history-reset-btn"
		/>
	);

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
			{incorrectCounterThisQuiz &&
			Object.keys(incorrectCounterThisQuiz).length > 0 && (
				<div className="QuizPage-question-history-container">
					<div className="QuizPage-question-history">
						<QuestionHistorySummary
							title="Check out the questions you've missed"
							incorrectCounterThisQuiz={incorrectCounterThisQuiz}
							quizId={quizId}
						/>
					</div>

					<ConfirmationModal
						btnComponent={resetButton}
						confirmationText="Are you sure?"
						confirmationSubText="This can't be undone."
						acceptText="Yes"
						rejectText="No"
						handleAccept={resetIncorrectCounts}
					/>
				</div>
			)}
		</div>
	);
}
