import React, { Component } from 'react';
import './AnswerForm.css';

// to-do refactor this to use hooks

class AnswerForm extends Component {
	constructor(props) {
		super(props);
		this.state = { answer: '' };
	}

	render() {
		return (
			<div className="AnswerForm">
				<form>
					<input className="AnswerForm-input" type="text" />
					<button className="AnswerForm-btn">Answer</button>
				</form>
			</div>
		);
	}
}

export default AnswerForm;
