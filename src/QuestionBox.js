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
		console.log('QuestionBox answerStatus', answerStatus === 'incorrect');
		return (
			<div className="QuestionBox">
				<div className="QuestionBox-content">
					<div className="QuestionBox-question">
						{questionPrefix}
						<b>{questionMainText}</b>
						{questionSuffix}
					</div>
					<AnswerForm
						handleAnswerSubmit={handleAnswerSubmit}
						practiceMode={practiceMode}
						answerStatus={answerStatus}
						correctAnswer={answer}
					/>
				</div>
			</div>
		);
	}
}

export default QuestionBox;
