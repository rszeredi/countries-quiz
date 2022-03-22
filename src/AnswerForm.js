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

	normalizeAnswer(a) {
		return a
			.trim()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/\s/g, '')
			.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'-]/g, '')
			.toLowerCase();
	}

	isCorrectAnswer() {
		console.log(this.normalizeAnswer(this.state.answer));
		return (
			this.normalizeAnswer(this.props.correctAnswer) ===
			this.normalizeAnswer(this.state.answer)
		);
	}

	handleSubmit(e) {
		e.preventDefault();
		const answerIsCorrect = this.isCorrectAnswer();
		this.setState({ answerStatus: answerIsCorrect ? 'correct' : 'incorrect' });

		setTimeout(() => {
			this.props.handleAnswerSubmit(answerIsCorrect);
			if (answerIsCorrect || !this.props.practiceMode) {
				this.setState({ answer: '', answerStatus: 'none' });
			} else {
				this.setState({ answer: '', answerStatus: 'practising' });
			}
		}, 700);
	}

	render() {
		const { answerStatus, answer } = this.state;
		const { correctAnswer } = this.props;
		return (
			<div className="AnswerForm">
				<div
					className="AnswerForm-answer"
					style={{
						visibility:
							answerStatus === 'practising' || answerStatus === 'incorrect'
								? 'visible'
								: 'hidden'
					}}
				>
					Correct answer:{' '}
					{answerStatus === 'practising' || answerStatus === 'incorrect' ? (
						correctAnswer
					) : (
						''
					)}
				</div>
				<form onSubmit={this.handleSubmit}>
					<input
						className={classNames('AnswerForm-input', {
							'AnswerForm-input-correct': answerStatus === 'correct',
							'AnswerForm-input-incorrect': answerStatus === 'incorrect'
						})}
						type="text"
						value={answer}
						name="answer"
						onChange={this.handleChange}
						autoComplete="off"
						disabled={answerStatus === 'correct' || answerStatus === 'incorrect'}
						ref={(input) => (this.inputValue = input)}
					/>
					<button type="submit" className="AnswerForm-btn">
						Answer
					</button>
				</form>
				<div
					className="QuestionBox-prompt"
					style={{
						visibility:
							answerStatus === 'practising' || answerStatus === 'incorrect'
								? 'visible'
								: 'hidden'
					}}
				>
					Type the correct answer
				</div>
			</div>
		);
	}
}

export default AnswerForm;
