import React, { useState, useEffect } from 'react';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import ScoreCard from './ScoreCard';

import './Quiz.css';
import QuestionBox from './QuestionBox';

// import useLocalStorageState from './hooks/useLocalStorageState'; // use this next

const INCORRECT_COUNTER_LOCAL_STORAGE_KEY = 'incorrectCounter';

/*

THINGS I'M UNSURE ABOUT
1. Where to put functions now that they're no longer methods? (At the moment, I have half inside and half outside because wasn't sure)
   Outside the function-based component? Inside the component? 
	 If they need to use setState function inside another function, should I just pass these in as arguments?

2. Updating state based on previous state. Is it guaranteed that the previous state will have already updated?
	 Eg. in updateScore function, replacing
	        this.setState((curSt) => ({ correct: curSt.correct + 1 })); 
		with 
		      setCorrect(currentCorrect + 1)
		     
3. Am I using useEffect in the correct way?

*/

function getFilteredQuestions(allQuestions, onlyPractiseIncorrect, quizId) {
	if (onlyPractiseIncorrect) {
		const incorrectCounts = getQuestionsWithIncorrectCounts();
		const questionsFiltered = allQuestions.filter((q) =>
			Object.keys(incorrectCounts[quizId]).includes(q.question)
		);
		return questionsFiltered;
	} else {
		return allQuestions;
	}
}

function getQuestionsWithIncorrectCounts() {
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

function existsQuestionsWithIncorrectCounts(quizId) {
	const incorrectCounterQuiz = getQuestionsWithIncorrectCounts()[quizId];

	if (incorrectCounterQuiz && Object.keys(incorrectCounterQuiz).length > 0) {
		return true;
	} else {
		return false;
	}
}

function getCurrentQuestion(questions, currentQuestionIdx) {
	const { question, answer } = questions[currentQuestionIdx];
	return { questionMainText: question, answer: answer };
}

function getNumRemainingQuestions(questions, currentQuestionIdx) {
	return questions.length - currentQuestionIdx;
}

function updateScore(answerIsCorrect, currentCorrect, setCorrect, currentIncorrect, setIncorrect) {
	if (answerIsCorrect) {
		setCorrect(currentCorrect + 1); // does this actually work (ie. is currentCorrect guaranteed to be updated?) Consider creating an "updateScore" custom hook
		// this.setState((curSt) => ({ correct: curSt.correct + 1 }));
	} else {
		setIncorrect(currentIncorrect + 1);
	}
}

function updateIncorrectCount(question, delta, quizId) {
	const incorrectCounter = getQuestionsWithIncorrectCounts();
	console.log('incorrectCounter', incorrectCounter);

	// to-do: refactor this - feels buggy
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

function Quiz(props) {
	const { quizProps } = props;
	const { quizId } = quizProps;
	const [ questionsAll, setQuestionsAll ] = useState([]);
	const [ questions, setQuestions ] = useState([]); // might be better (ie. more space efficient) to just store the desired indices
	const [ loadingData, setLoadingData ] = useState(true);
	const [ correct, setCorrect ] = useState(0);
	const [ incorrect, setIncorrect ] = useState(0);
	const [ currentQuestionIdx, setCurrentQuestionIdx ] = useState(0);
	const [ repeatCorrectAnswerMode, setRepeatCorrectAnswerMode ] = useState(false);
	const [ practiceMode, setPracticeMode ] = useState(true);
	const [ answerStatus, setAnswerStatus ] = useState('none');
	const [ onlyPractiseIncorrect, setOnlyPractiseIncorrect ] = useState(false);

	useEffect(() => {
		console.log('useEffect');

		const getQuestions = async () => {
			const allQuestions = await quizProps.questionGetter();
			console.log('allQuestions', allQuestions);
			let questionsFiltered = getFilteredQuestions(allQuestions);
			if (onlyPractiseIncorrect) {
				const incorrectCounts = getQuestionsWithIncorrectCounts();
				questionsFiltered = allQuestions.filter((q) =>
					Object.keys(incorrectCounts[quizId]).includes(q.question)
				);
			}

			// should set state inside the async function according to : https://devtrium.com/posts/async-functions-useeffect
			setQuestionsAll(allQuestions);
			setQuestions(questionsFiltered);
			setLoadingData(false);
		};
		getQuestions(); // todo need to catch this?
	}, []); // when should useEffect this be called??

	const handleAnswerSubmit = (answerIsCorrect) => {
		// need to pass answerStatus to the QuestionBox
		if (answerIsCorrect) {
			setAnswerStatus('correct');
			if (!repeatCorrectAnswerMode) {
				updateIncorrectCount(questions[currentQuestionIdx].question, -1, quizId);
			}
		} else {
			setAnswerStatus('incorrect');
			if (!repeatCorrectAnswerMode) {
				updateIncorrectCount(questions[currentQuestionIdx].question, 1, quizId);
			}
		}

		// Only update the score if we're not in repeatCorrectAnswerMode mode
		if (!repeatCorrectAnswerMode) {
			updateScore(answerIsCorrect, correct, setCorrect, incorrect, setIncorrect);
		}

		// if the answer is not correct, show the answer prompt the user to type the correct answer
		if (!answerIsCorrect && practiceMode) {
			setRepeatCorrectAnswerMode(true);
		} else {
			// if the answer is correct, switch off repeatCorrectAnswerMode= and proceed to the next question
			setRepeatCorrectAnswerMode(false);
			setAnswerStatus('none');
			setCurrentQuestionIdx(currentQuestionIdx + 1); // TODO: is this guaranteed?
		}
	};

	const resetScores = () => {
		setCorrect(0);
		setIncorrect(0);
	};

	const resetGame = (practiseIncorrectModeOnNext) => {
		setOnlyPractiseIncorrect(practiseIncorrectModeOnNext);
		setCurrentQuestionIdx(0);
		setQuestions(getFilteredQuestions(questionsAll, practiseIncorrectModeOnNext, quizId));
		resetScores();
	};

	const getDisplay = (remaining) => {
		const { questionPrefix, questionSuffix, subsetCountsAsCorrect } = props.quizProps;

		const numInIncorrectCounter = existsQuestionsWithIncorrectCounts(quizId);

		if (remaining > 0) {
			return (
				<QuestionBox
					{...getCurrentQuestion(questions, currentQuestionIdx)}
					questionPrefix={questionPrefix}
					questionSuffix={questionSuffix}
					handleAnswerSubmit={handleAnswerSubmit}
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
					<button className="Quiz-restart-btn" onClick={resetGame}>
						Start Over
					</button>
					{numInIncorrectCounter && (
						<button className="Quiz-restart-btn" onClick={resetGame}>
							Practise the Ones You Don't Know!
						</button>
					)}
				</div>
			);
		}
	};

	const handlePracticeModeChange = (event) => {
		setPracticeMode(event.target.checked);
	};

	const getPractiseModeSwitch = () => {
		return (
			<FormGroup>
				<FormControlLabel
					control={<Switch checked={practiceMode} />}
					label="Practice Mode"
					labelPlacement="start"
					onChange={handlePracticeModeChange}
				/>
			</FormGroup>
		);
	};

	const remaining = getNumRemainingQuestions(questions, currentQuestionIdx);

	return (
		<div className="Quiz">
			<h1>{quizProps.title}</h1>
			<div className="Quiz-switch-container">{getPractiseModeSwitch()}</div>
			<ScoreCard correct={correct} incorrect={incorrect} remaining={remaining} />
			{getDisplay(remaining)}
		</div>
	);
}

export default Quiz;
