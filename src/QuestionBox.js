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
			handleAnswerSubmit,
			subsetCountsAsCorrect,
			isMultiChoiceQuestion,
			answerPool
		} = this.props;

		return (
			<div className="QuestionBox">
				<div className="QuestionBox-content">
					<div className="QuestionBox-question">
						{questionPrefix}
						<b>{questionMainText}</b>
						{questionSuffix}
					</div>
					{isMultiChoiceQuestion ? (
						<AnswerMultiChoiceButtons
							correctAnswer={answer}
							handleAnswerSubmit={handleAnswerSubmit}
							answerPool={answerPool}
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
