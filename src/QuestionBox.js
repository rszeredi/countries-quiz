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
			handleAnswerSubmit,
			subsetCountsAsCorrect
		} = this.props;

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
						subsetCountsAsCorrect={subsetCountsAsCorrect}
					/>
				</div>
			</div>
		);
	}
}

export default QuestionBox;
