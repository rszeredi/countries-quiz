import React, { Component } from 'react';
import AnswerForm from './AnswerForm';

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
			handleAnswerSubmit
		} = this.props;
		return (
			<div className="QuestionBox">
				<div className="QuestionBox-content">
					<div className="QuestionBox-question">
						{questionPrefix}
						<b>{questionMainText}</b>
						{questionSuffix}
					</div>
					<div
						className="QuestionBox-answer"
						style={{ visibility: practiceMode ? 'visible' : 'hidden' }}
					>
						Correct answer: {practiceMode ? answer : ''}
					</div>
					<AnswerForm
						handleAnswerSubmit={handleAnswerSubmit}
						answerStatus={answerStatus}
						correctAnswer={answer}
					/>
					<div
						className="QuestionBox-prompt"
						style={{ visibility: practiceMode ? 'visible' : 'hidden' }}
					>
						Type the correct answer
					</div>
				</div>
			</div>
		);
	}
}

export default QuestionBox;
