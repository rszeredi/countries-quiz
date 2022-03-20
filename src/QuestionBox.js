import React, { Component } from 'react';
import AnswerForm from './AnswerForm';

import './QuestionBox.css';

class QuestionBox extends Component {
	render() {
		// const {questionText} = this.props;
		const questionText = 'What is the capital city of France?';
		return (
			<div className="QuestionBox">
				<div className="QuestionBox-content">
					<div className="QuestionBox-question">{questionText}</div>
					<AnswerForm />
				</div>
			</div>
		);
	}
}

export default QuestionBox;
