import React, { useState, useEffect } from 'react';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import ScoreCard from './ScoreCard';
import QuestionBox from './QuestionBox';

import {
	getFilteredQuestions,
	getQuestionsWithIncorrectCounts,
	existsQuestionsWithIncorrectCounts,
	getCurrentQuestion,
	updateScore,
	updateIncorrectCount,
	getNumRemainingQuestions
} from './quizHelpers';

// import useLocalStorageState from './hooks/useLocalStorageState'; // use this next

import './Quiz.css';

const INCORRECT_COUNTER_LOCAL_STORAGE_KEY = 'incorrectCounter';

/*

THINGS I'M UNSURE ABOUT (from the class->function+hooks refactor)
1. a)
	 Where to put functions now that they're no longer methods? (At the moment, I have half inside and half outside because wasn't sure)
   Outside the function-based component? Inside the component? 
	 If they need to use setState function inside another function, should I just pass these in as arguments?


	 1 b)
	 Is it bad practice for nested functions to rely on state variables (in the outer scope?), or should they be turned into parameters?
	 Eg. handleAnswerSubmit uses currentQuestionIdx (which is a state variable)

2. Updating state based on previous state. Is it guaranteed that the previous state will have already updated?
	 Eg. in updateScore function, replacing
	        this.setState((curSt) => ({ correct: curSt.correct + 1 })); 
		with 
		      setCorrect(currentCorrect + 1)
		     
3. Am I using useEffect in the correct way? (ie. as a replacement for componentDidMount)

4. Do I have too many state variables?

*/

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
				const incorrectCounts = getQuestionsWithIncorrectCounts(
					INCORRECT_COUNTER_LOCAL_STORAGE_KEY
				);
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
	}, []); // when should useEffect be called??

	const handleAnswerSubmit = (answerIsCorrect) => {
		// need to pass answerStatus to the QuestionBox
		if (answerIsCorrect) {
			setAnswerStatus('correct');
			if (!repeatCorrectAnswerMode) {
				updateIncorrectCount(
					questions[currentQuestionIdx].question,
					-1,
					quizId,
					INCORRECT_COUNTER_LOCAL_STORAGE_KEY
				);
			}
		} else {
			setAnswerStatus('incorrect');
			if (!repeatCorrectAnswerMode) {
				updateIncorrectCount(
					questions[currentQuestionIdx].question,
					1,
					quizId,
					INCORRECT_COUNTER_LOCAL_STORAGE_KEY
				);
			}
		}

		// Only update the score if we're not in repeatCorrectAnswerMode mode
		if (!repeatCorrectAnswerMode) {
			updateScore(answerIsCorrect, correct, setCorrect, incorrect, setIncorrect);
		}

		// if the answer is not correct, show the answer prompt to the user again to type the correct answer,
		// until they get the correct answer
		if (!answerIsCorrect && practiceMode) {
			setRepeatCorrectAnswerMode(true);
		} else {
			// if the answer is correct, switch off repeatCorrectAnswerMode and proceed to the next question
			setRepeatCorrectAnswerMode(false);
			setAnswerStatus('none');
			setCurrentQuestionIdx(currentQuestionIdx + 1); // TODO: is it guaranteed that currentQuestionIdx is already updated?
		}
	};

	const resetScores = () => {
		setCorrect(0);
		setIncorrect(0);
	};

	const resetGame = (practiseIncorrectModeOnNext) => {
		setOnlyPractiseIncorrect(practiseIncorrectModeOnNext);
		setCurrentQuestionIdx(0);
		setQuestions(
			getFilteredQuestions(
				questionsAll,
				practiseIncorrectModeOnNext,
				quizId,
				INCORRECT_COUNTER_LOCAL_STORAGE_KEY
			)
		);
		resetScores();
	};

	const getDisplay = (numRemainingQuestions) => {
		const { questionPrefix, questionSuffix, subsetCountsAsCorrect } = quizProps;
		const numInIncorrectCounter = existsQuestionsWithIncorrectCounts(
			quizId,
			INCORRECT_COUNTER_LOCAL_STORAGE_KEY
		);

		if (numRemainingQuestions > 0) {
			return (
				<QuestionBox
					{...getCurrentQuestion(questions, currentQuestionIdx)}
					questionPrefix={questionPrefix}
					questionSuffix={questionSuffix}
					practiceMode={practiceMode}
					answerStatus={answerStatus}
					subsetCountsAsCorrect={subsetCountsAsCorrect}
					handleAnswerSubmit={handleAnswerSubmit}
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
					<button className="Quiz-restart-btn" onClick={() => resetGame(false)}>
						Start Over
					</button>
					{numInIncorrectCounter && (
						<button className="Quiz-restart-btn" onClick={() => resetGame(true)}>
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

	const numRemainingQuestions = getNumRemainingQuestions(questions, currentQuestionIdx);
	return (
		<div className="Quiz">
			<h1>{quizProps.title}</h1>
			<div className="Quiz-switch-container">{getPractiseModeSwitch()}</div>
			<ScoreCard correct={correct} incorrect={incorrect} remaining={numRemainingQuestions} />
			{getDisplay(numRemainingQuestions)}
		</div>
	);
}

export default Quiz;
