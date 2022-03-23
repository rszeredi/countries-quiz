import React, { Component } from 'react';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import ScoreCard from './ScoreCard';

import './Quiz.css';
import QuestionBox from './QuestionBox';

import quizzes from './QuizProps';

class Quiz extends Component {
	static defaultProps = {
		quizProps: quizzes[0]
	};
	constructor(props) {
		super(props);
		this.state = {
			questions: [],
			loadingData: true,
			correct: 0,
			incorrect: 0,
			currentQuestionIdx: 0,
			repeatCorrectAnswerMode: false,
			practiceMode: true,
			showAnswer: false,
			answerStatus: 'none'
		};

		this.getCurrentQuestion = this.getCurrentQuestion.bind(this);
		this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
		this.resetQuestions = this.resetQuestions.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	async componentDidMount() {
		this.setState({
			questions: await this.props.quizProps.questionGetter(),
			loadingData: false
		});
	}

	getCurrentQuestion() {
		const { question, answer } = this.state.questions[this.state.currentQuestionIdx];
		return { questionMainText: question, answer: answer };
	}

	getNumRemainingQuestions() {
		return this.state.questions.length - this.state.currentQuestionIdx;
	}

	updateScore(answerIsCorrect) {
		if (answerIsCorrect) {
			this.setState((curSt) => ({ correct: curSt.correct + 1 }));
		} else {
			this.setState((curSt) => ({ incorrect: curSt.incorrect + 1 }));
		}
	}

	handleAnswerSubmit(answerIsCorrect) {
		// need to pass answerStatus to the QuestionBox
		if (answerIsCorrect) {
			this.setState({ answerStatus: 'correct' });
		} else {
			this.setState({ answerStatus: 'incorrect' });
		}

		// Only update the score if we're not in repeatCorrectAnswerMode mode
		if (!this.state.repeatCorrectAnswerMode) {
			this.updateScore(answerIsCorrect);
		}

		// if the answer is not correct, show the answer prompt the user to type the correct answer
		if (!answerIsCorrect && this.state.practiceMode) {
			this.setState({ repeatCorrectAnswerMode: true });
		} else {
			// if the answer is correct, switch off repeatCorrectAnswerMode= and proceed to the next question
			this.setState((curSt) => ({
				repeatCorrectAnswerMode: false,
				answerStatus: 'none',
				currentQuestionIdx: curSt.currentQuestionIdx + 1
			}));
		}
	}

	resetScores() {
		this.setState({ correct: 0, incorrect: 0 });
	}

	resetQuestions() {
		this.setState({ currentQuestionIdx: 0 });
		this.resetScores();
	}

	getDisplay(remaining) {
		const { loadingData, practiceMode, answerStatus } = this.state;
		const { questionPrefix, questionSuffix, subsetCountsAsCorrect } = this.props.quizProps;
		if (remaining > 0) {
			return (
				<QuestionBox
					{...this.getCurrentQuestion()}
					questionPrefix={questionPrefix}
					questionSuffix={questionSuffix}
					handleAnswerSubmit={this.handleAnswerSubmit}
					practiceMode={practiceMode}
					answerStatus={answerStatus}
					subsetCountsAsCorrect={subsetCountsAsCorrect}
				/>
			);
		} else if (loadingData) {
			return (
				<div className="Quiz-loading">
					<h1>Loading...</h1>
				</div>
			);
		} else {
			return (
				<div className="Quiz-restart">
					{/* <i className="fa-solid fa-arrow-rotate-left" /> */}
					<i className="fa-solid arrow-left" />
					Finished all questions!
					<button className="Quiz-restart-btn" onClick={this.resetQuestions}>
						Start Over
					</button>
				</div>
			);
		}
	}

	handleChange(event) {
		this.setState((curSt) => ({ practiceMode: event.target.checked }));
	}

	getSwitch() {
		return (
			<FormGroup>
				<FormControlLabel
					control={<Switch checked={this.state.practiceMode} />}
					label="Practice Mode"
					labelPlacement="start"
					onChange={this.handleChange}
				/>
			</FormGroup>
		);
	}

	render() {
		const { correct, incorrect } = this.state;
		const remaining = this.getNumRemainingQuestions();

		return (
			<div className="Quiz">
				<h1>{this.props.quizProps.title}</h1>
				<div className="Quiz-switch-container">{this.getSwitch()}</div>
				<ScoreCard correct={correct} incorrect={incorrect} remaining={remaining} />
				{this.getDisplay(remaining)}
			</div>
		);
	}
}

export default Quiz;
