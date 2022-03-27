import React, { useState, useEffect, useRef } from 'react';

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

import useQuizState from './hooks/useQuizState';

import './Quiz.css';

const INCORRECT_COUNTER_LOCAL_STORAGE_KEY = `incorrectCounter`;

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

5. How much can I store in localStorage?

*/

function Quiz(props) {
	// We can then use this variable to prevent the side effect from taking place during the initial render.
	// https://www.thearmchaircritic.org/tech-journal/prevent-useeffects-callback-firing-during-initial-render
	const isMounted = useRef(false); // https://typeofnan.dev/how-to-prevent-useeffect-from-running-on-mount-in-react/

	const { quizProps } = props;
	const { quizId } = quizProps;

	const {
		quizState,
		setQuestionsAll,
		setQuestions,
		setCurrentQuestionIdx,
		setCorrect,
		setIncorrect,
		setOnlyPractiseIncorrect,
		setPracticeMode
	} = useQuizState(quizId);
	const {
		questionsAll,
		questions,
		currentQuestionIdx,
		correct,
		incorrect,
		onlyPractiseIncorrect,
		practiceMode
	} = quizState;
	// console.log('quizState', quizState);

	const questionsExistInIncorrectCounter = existsQuestionsWithIncorrectCounts(
		quizId,
		INCORRECT_COUNTER_LOCAL_STORAGE_KEY
	);

	const [ loadingData, setLoadingData ] = useState(true);

	const [ repeatCorrectAnswerMode, setRepeatCorrectAnswerMode ] = useState(false);
	const [ answerStatus, setAnswerStatus ] = useState('none');

	useEffect(() => {
		console.log('useEffect initial');

		// only get questions if they're not already defined in localStorage
		if (questions.length === 0) {
			getQuestionsFromQuizPropsGetter(onlyPractiseIncorrect); // todo need to catch this?
		}
	}, []); // when should useEffect be called??

	const getQuestionsFromQuizPropsGetter = async (onlyPractiseIncorrect) => {
		const allQuestions = await quizProps.questionGetter();
		let questionsFiltered = getFilteredQuestions(
			allQuestions,
			onlyPractiseIncorrect,
			quizId,
			INCORRECT_COUNTER_LOCAL_STORAGE_KEY
		);
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
		// setLoadingData(false);
	};

	// useEffect(
	// 	() => {
	// 		console.log('loadingData useEffect', loadingData);
	// 	},
	// 	[ loadingData ]
	// );

	useEffect(
		() => {
			if (questionsAll.length) {
				setLoadingData(false);
			} else {
				setLoadingData(true);
			}
		},
		[ questionsAll ]
	);

	useEffect(
		() => {
			if (questions.length) {
				setLoadingData(false);
			} else {
				setLoadingData(true);
			}
		},
		[ questions ]
	);

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

	const resetGame = async (practiseIncorrectModeOnNext) => {
		setOnlyPractiseIncorrect(practiseIncorrectModeOnNext);
		setCurrentQuestionIdx(0);

		// we don't load all questions every time Quiz renders - only if questions is empty (see useEffect). This saves some API calls
		// when the game is reset, allQuestions should be reloaded so that we can serve up new questions

		let questionsFromQuizPropsGetter;
		if (!questionsAll.length) {
			setLoadingData(true);
			getQuestionsFromQuizPropsGetter(practiseIncorrectModeOnNext);
		}

		const questionsFiltered = getFilteredQuestions(
			questionsAll || questionsFromQuizPropsGetter,
			practiseIncorrectModeOnNext,
			quizId,
			INCORRECT_COUNTER_LOCAL_STORAGE_KEY
		);
		setQuestions(questionsFiltered);
		resetScores();
	};

	useEffect(
		() => {
			if (isMounted.current) {
				console.log('resetting game');
				resetGame(onlyPractiseIncorrect);
			} else {
				isMounted.current = true;
			}
		},
		[ onlyPractiseIncorrect ]
	);

	const getDisplay = (numRemainingQuestions) => {
		const { questionPrefix, questionSuffix, subsetCountsAsCorrect } = quizProps;
		if (loadingData) {
			return (
				<div className="Quiz-loading">
					<h1>Loading...</h1>
				</div>
			);
		} else if (numRemainingQuestions > 0) {
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
		} else {
			return (
				<div className="Quiz-restart">
					{/* <i className="fa-solid fa-arrow-rotate-left" /> */}
					<i className="fa-solid arrow-left" />
					Finished all questions!
					<button className="Quiz-restart-btn" onClick={() => resetGame(false)}>
						Start Over
					</button>
					{questionsExistInIncorrectCounter && (
						<button className="Quiz-restart-btn" onClick={() => resetGame(true)}>
							Practise the Ones You Don't Know!
						</button>
					)}
				</div>
			);
		}
	};

	const getSwitch = (label, state, stateSetter, disabled = false) => {
		const handler = (event) => {
			stateSetter(event.target.checked);
		};
		return (
			<FormGroup>
				<FormControlLabel
					control={<Switch checked={state} />}
					label={label}
					labelPlacement="start"
					onChange={handler}
					disabled={disabled}
				/>
			</FormGroup>
		);
	};

	const numRemainingQuestions = getNumRemainingQuestions(questions, currentQuestionIdx);
	return (
		<div className="Quiz">
			<h1>{quizProps.title}</h1>
			<div className="Quiz-switch-container">
				{getSwitch('Practice Mode', practiceMode, setPracticeMode)}
				{getSwitch(
					'Incorrect Only',
					onlyPractiseIncorrect,
					setOnlyPractiseIncorrect,
					!questionsExistInIncorrectCounter // disabled - how to pass as parameter name?
				)}
			</div>
			<ScoreCard correct={correct} incorrect={incorrect} remaining={numRemainingQuestions} />
			{getDisplay(numRemainingQuestions)}
		</div>
	);
}

export default Quiz;
