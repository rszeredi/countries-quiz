import React, { Component } from 'react';
import AnswerForm from './AnswerForm';
import AnswerMultiChoiceButtons from './AnswerMultiChoiceButtons';

import './QuestionBox.css';

class QuestionBox extends Component {
	render() {
		const {
			questionMainText,
			questionPrefix,
			questionSuffix,
			practiceMode,
			answer,
			answerStatus,
			repeatCorrectAnswerMode,
			handleAnswerSubmit,
			subsetCountsAsCorrect,
			isMultiChoiceQuestion,
			isFlagsQuiz,
			quizCategory,
			questionsAll,
			isReverseQuiz
		} = this.props;

		return (
			<div className="QuestionBox">
				<div className="QuestionBox-content">
					<div className="QuestionBox-question">
						{questionPrefix}
						<b style={isFlagsQuiz && isReverseQuiz ? { fontSize: '3rem' } : {}}>
							{questionMainText}
						</b>
						{questionSuffix}
					</div>
					{isMultiChoiceQuestion ? (
						<AnswerMultiChoiceButtons
							correctAnswer={answer}
							isFlagsQuiz={isFlagsQuiz}
							quizCategory={quizCategory}
							handleAnswerSubmit={handleAnswerSubmit}
							repeatCorrectAnswerMode={repeatCorrectAnswerMode}
							practiceMode={practiceMode}
							questionsAll={questionsAll}
							isReverseQuiz={isReverseQuiz}
						/>
					) : (
						<AnswerForm
							handleAnswerSubmit={handleAnswerSubmit}
							practiceMode={practiceMode}
							answerStatus={answerStatus}
							correctAnswer={answer}
							subsetCountsAsCorrect={subsetCountsAsCorrect}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default QuestionBox;
