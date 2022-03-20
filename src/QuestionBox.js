import React, { Component } from 'react';
import AnswerForm from './AnswerForm';

import './QuestionBox.css';

class QuestionBox extends Component {
	render() {
		const { questionText } = this.props;
		return (
			<div className="QuestionBox">
				<div className="QuestionBox-content">
					<div className="QuestionBox-question">{questionText}</div>
					<AnswerForm handleAnswerSubmit={this.props.handleAnswerSubmit} />
				</div>
			</div>
		);
	}
}

export default QuestionBox;
