import React, { Component } from 'react';
import './AnswerForm.css';

// to-do refactor this to use hooks

class AnswerForm extends Component {
	constructor(props) {
		super(props);
		this.state = { answer: '' };
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	render() {
		return (
			<div className="AnswerForm">
				<form>
					<input
						className="AnswerForm-input"
						type="text"
						value={this.state.answer}
						name="answer"
						onChange={this.handleChange}
					/>
					<button className="AnswerForm-btn">Answer</button>
				</form>
			</div>
		);
	}
}

export default AnswerForm;
