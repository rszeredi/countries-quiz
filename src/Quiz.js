import React, { Component } from 'react';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import ScoreCard from './ScoreCard';

import './Quiz.css';
import QuestionBox from './QuestionBox';

import quizzes from './QuizProps';

const INCORRECT_COUNTER_LOCAL_STORAGE_KEY = 'incorrectCounter';

class Quiz extends Component {
	static defaultProps = {
		quizProps: quizzes[0]
	};
	constructor(props) {
		super(props);
		this.state = {
			questionsAll: [],
			questions: [], // might be better (ie. more space efficient) to just store the desired indices
			loadingData: true,
			correct: 0,
			incorrect: 0,
			currentQuestionIdx: 0,
			repeatCorrectAnswerMode: false,
			practiceMode: true,
			showAnswer: false,
			answerStatus: 'none',
			onlyPractiseIncorrect: false
		};

		this.getCurrentQuestion = this.getCurrentQuestion.bind(this);
		this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
		this.resetQuestions = this.resetQuestions.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.resetInPractiseIncorrectMode = this.resetInPractiseIncorrectMode.bind(this);
	}

	async componentDidMount() {
		const allQuestions = await this.props.quizProps.questionGetter();
		let questionsFiltered = this.getFilteredQuestions(allQuestions);
		if (this.state.onlyPractiseIncorrect) {
			const incorrectCounts = this.getQuestionsWithIncorrectCounts();
			questionsFiltered = allQuestions.filter((q) =>
				Object.keys(incorrectCounts[this.props.quizProps.quizId]).includes(q.question)
			);
		}
		this.setState({
			questionsAll: allQuestions,
			questions: questionsFiltered,
			loadingData: false
		});
	}

	getFilteredQuestions(allQuestions) {
		if (this.state.onlyPractiseIncorrect) {
			const incorrectCounts = this.getQuestionsWithIncorrectCounts();
			const questionsFiltered = allQuestions.filter((q) =>
				Object.keys(incorrectCounts[this.props.quizProps.quizId]).includes(q.question)
			);
			return questionsFiltered;
		} else {
			return allQuestions;
		}
	}

	getQuestionsWithIncorrectCounts() {
		let incorrectCounter;
		try {
			incorrectCounter = JSON.parse(
				window.localStorage.getItem(INCORRECT_COUNTER_LOCAL_STORAGE_KEY) || '{}'
			);
		} catch (e) {
			incorrectCounter = {};
		}
		return incorrectCounter;
	}

	existsQuestionsWithIncorrectCounts() {
		const { quizId } = this.props.quizProps;
		const incorrectCounterQuiz = this.getQuestionsWithIncorrectCounts()[quizId];

		if (incorrectCounterQuiz && Object.keys(incorrectCounterQuiz).length > 0) {
			return true;
		} else {
			return false;
		}
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

	updateIncorrectCount(question, delta) {
		const incorrectCounter = this.getQuestionsWithIncorrectCounts();

		// to-do: refactor this - feels buggy
		const { quizId } = this.props.quizProps;
		if (!(quizId in incorrectCounter)) {
			incorrectCounter[quizId] = {};
		}
		const newVal = (incorrectCounter[quizId][question] || 0) + delta;

		if (newVal > 0) {
			incorrectCounter[quizId][question] = newVal;
		} else {
			delete incorrectCounter[quizId][question];
		}

		console.log(incorrectCounter[quizId]);

		window.localStorage.setItem(
			INCORRECT_COUNTER_LOCAL_STORAGE_KEY,
			JSON.stringify(incorrectCounter)
		);
	}

	handleAnswerSubmit(answerIsCorrect) {
		// need to pass answerStatus to the QuestionBox
		if (answerIsCorrect) {
			this.setState({ answerStatus: 'correct' });
			if (!this.state.repeatCorrectAnswerMode) {
				this.updateIncorrectCount(
					this.state.questions[this.state.currentQuestionIdx].question,
					-1
				);
			}
		} else {
			this.setState({ answerStatus: 'incorrect' });
			if (!this.state.repeatCorrectAnswerMode) {
				this.updateIncorrectCount(
					this.state.questions[this.state.currentQuestionIdx].question,
					1
				);
			}
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

	resetInPractiseIncorrectMode() {
		this.setState({ onlyPractiseIncorrect: true }, this.resetQuestions);
	}

	resetQuestions() {
		this.setState({
			onlyPractiseIncorrect: false,
			currentQuestionIdx: 0,
			questions: this.getFilteredQuestions(this.state.questionsAll)
		});
		this.resetScores();
	}

	getDisplay(remaining) {
		const { loadingData, practiceMode, answerStatus } = this.state;
		const { questionPrefix, questionSuffix, subsetCountsAsCorrect } = this.props.quizProps;

		const numInIncorrectCounter = this.existsQuestionsWithIncorrectCounts();

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
					{numInIncorrectCounter && (
						<button
							className="Quiz-restart-btn"
							onClick={this.resetInPractiseIncorrectMode}
						>
							Practise the Ones You Didn't Get!
						</button>
					)}
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
