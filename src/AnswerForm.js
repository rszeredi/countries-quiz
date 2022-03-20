import React, { Component } from 'react';
import classNames from 'classnames';

import './AnswerForm.css';

// to-do refactor this to use hooks

class AnswerForm extends Component {
	constructor(props) {
		super(props);
		this.state = { answer: '', answerStatus: 'none' };
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidUpdate() {
		this.inputValue.focus();
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	isCorrectAnswer() {
		return this.props.correctAnswer.toLowerCase() === this.state.answer.toLowerCase();
	}

	handleSubmit(e) {
		e.preventDefault();
		const answerIsCorrect = this.isCorrectAnswer();

		if (answerIsCorrect) {
			this.setState({ answerStatus: 'correct' });
		} else {
			this.setState({ answerStatus: 'incorrect' });
		}
		setTimeout(() => {
			this.props.handleAnswerSubmit(answerIsCorrect);
			this.setState({ answer: '', answerStatus: 'none' });
		}, 700);
	}

	render() {
		const { answerStatus } = this.state;
		return (
			<div className="AnswerForm">
				<form onSubmit={this.handleSubmit}>
					<input
						className={classNames('AnswerForm-input', {
							'AnswerForm-input-correct': answerStatus === 'correct',
							'AnswerForm-input-incorrect': answerStatus === 'incorrect'
						})}
						type="text"
						value={this.state.answer}
						name="answer"
						onChange={this.handleChange}
						autoComplete="off"
						disabled={this.state.answerStatus !== 'none'}
						ref={(input) => (this.inputValue = input)}
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
