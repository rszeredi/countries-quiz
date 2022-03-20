import React, { Component } from 'react';
import './AnswerForm.css';

// to-do refactor this to use hooks

class AnswerForm extends Component {
	constructor(props) {
		super(props);
		this.state = { answer: '' };
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.handleAnswerSubmit(this.state.answer);
		this.setState({ answer: '' });
	}

	render() {
		return (
			<div className="AnswerForm">
				<form onSubmit={this.handleSubmit}>
					<input
						className="AnswerForm-input"
						type="text"
						value={this.state.answer}
						name="answer"
						onChange={this.handleChange}
						autoComplete="off"
					/>
					<button type="submit" className="AnswerForm-btn">
						Answer
					</button>
				</form>
			</div>
		);
	}
}

export default AnswerForm;
