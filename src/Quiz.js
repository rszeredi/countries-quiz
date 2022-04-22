import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import ScoreCard from './ScoreCard';
import QuestionBox from './QuestionBox';

import {
	getFilteredQuestions,
	getQuestionsWithIncorrectCounts,
	existsQuestionsWithIncorrectCounts,
	getCurrentQuestion,
	updateScore,
	updateIncorrectCount,
	getNumRemainingQuestions,
	INCORRECT_COUNTER_LOCAL_STORAGE_KEY
} from './quizHelpers';

import useQuizState from './hooks/useQuizState';

import './Quiz.css';
import { Link } from 'react-router-dom';
import QuestionHistorySummary from './QuestionHistorySummary';
import ActionButton from './ActionButton';
// import useToggleState from './hooks/useToggleState';
import ConfirmationModal from './ConfirmationModal';

const SCORE_MESSAGES = [
	[ 100, "You're a Genius!" ],
	[ 95, 'Impressive!' ],
	[ 90, 'You beauty!' ],
	[ 80, 'Great Work!' ],
	[ 70, 'Solid Effort' ],
	[ 60, 'Not bad, not bad' ],
	[ 50, 'You gave it your best shot' ],
	[ 40, 'Pretty average' ],
	[ 30, 'You might need to study a little...' ],
	[ 20, 'Did you even try?' ],
	[ 10, 'Could be worse...' ],
	[ 0, 'Are you asleep?' ]
];

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

	const { quizProps, isInStudyMode } = props;

	const {
		quizId,
		category,
		practiceModeAllowed,
		multiChoiceAllowed,
		typeAnswerAllowed
	} = quizProps;
	const navigate = useNavigate();

	const {
		quizState,
		setQuestionsAll,
		setQuestions,
		setCurrentQuestionIdx,
		setCorrect,
		setIncorrect,
		setPracticeMode
	} = useQuizState(quizId, isInStudyMode);

	const {
		questionsAll,
		questions,
		currentQuestionIdx,
		correct,
		incorrect,
		practiceMode
	} = quizState;

	// console.log('quizState', quizState);

	const questionsExistInIncorrectCounter = existsQuestionsWithIncorrectCounts(
		quizId,
		INCORRECT_COUNTER_LOCAL_STORAGE_KEY
	);

	const [ loadingData, setLoadingData ] = useState(true);
	const [ isMultiChoice, setIsMultiChoice ] = useState(true); // move this to quiz state, only allow for capital cities & currencies

	const [ repeatCorrectAnswerMode, setRepeatCorrectAnswerMode ] = useState(false);
	const [ answerStatus, setAnswerStatus ] = useState('none');

	/* 
	answerStatus:
	none: when a new question has been served and we are waiting for user to answer
	correct: user answered correctly, and we wait some time before moving to next question (at which point answerStatus gets set back to none)
	incorrect: same as above but if user answered incorrectly
	answered: I guess I ended up with another answerStatus state variable inside AnswerMultiChoiceButtons, woops! 
			Probably my initial thinking was that answerStatus should be pushed up to the parent (to try to have stateless children) but I 
			think since this is mainly for UI purposes it might be ok to have it within the Answer child components

	repeatCorrectAnswerMode:
	This is used when in "Typing" mode and the user answered incorrectly, we show them the correct answer
	and prompt them to type it
	I'm not sure whether this state should leave up here? Though it is used to determine whether or not to update the score.
	Also, I realized I created a sort of duplicates (two of them) for this inside both:
			1. AnswerForm: answerStatus === 'practising'. This is used to determine whether or not to show the correct answer inside AnswerForm. (So it's not quite the same as answerStatus here in Quiz)
			2. AnswerMultiChoiceButtons: This is used to determine how to color the buttons (ie. by adding class names)

	For multichoice: there's a similar mode where the user needs to click the correct answer (ie. we don't tell them)
	For this I will create a new state variable within MultiChoiceButtons and pass in practiceMode from Quiz.js

	*/

	useEffect(() => {
		console.log('useEffect initial');

		// only get questions if they're not already defined in localStorage
		if (questions.length === 0) {
			getQuestionsFromQuizPropsGetter(isInStudyMode).catch((err) => {
				console.error(err);
			});
		}
	}, []); // when should useEffect be called??

	const getQuestionsFromQuizPropsGetter = async (isInStudyMode) => {
		const allQuestions = await quizProps.questionGetter();
		const questionsFiltered = getFilteredQuestions(
			allQuestions,
			isInStudyMode,
			quizId,
			INCORRECT_COUNTER_LOCAL_STORAGE_KEY
		);

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
		// setOnlyPractiseIncorrect(practiseIncorrectModeOnNext);
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

	const resetGameWithAllQuestions = () => resetGame(false);
	const resetGameWithIncorrectOnly = () => resetGame(true);

	// useEffect(
	// 	() => {
	// 		if (isMounted.current) {
	// 			console.log('resetting game');
	// 			resetGame(onlyPractiseIncorrect);
	// 		} else {
	// 			isMounted.current = true;
	// 		}
	// 	},
	// 	[ onlyPractiseIncorrect ]
	// );
	const restartQuizButton = (
		<ActionButton
			btnContent={isInStudyMode ? 'Study All Again' : 'Try Quiz Again'}
			handleClick={resetGameWithAllQuestions}
		/>
	);

	const goToStudyMode = (
		<ActionButton
			btnContent={
				<Link
					to={quizProps.makeQuizRouteString() + '/study'}
					// onClick={resetGameWithIncorrectOnly}
				>
					Go to Study Mode
				</Link>
			}
			handleClick={resetGameWithIncorrectOnly}
		/>
	);

	const resetInStudyModeAllButton = (
		<ActionButton btnContent="Study All Again" handleClick={resetGameWithAllQuestions} />
	);

	const resetInStudyModeButton = (
		<ActionButton
			btnContent="Study the Ones You Don't Know"
			handleClick={resetGameWithIncorrectOnly}
		/>
	);

	const goToQuizModeButton = (
		<ActionButton
			btnContent={
				<Link
					to={quizProps.makeQuizRouteString() + '/quiz'}
					onClick={resetGameWithAllQuestions}
				>
					Quiz Yourself!
				</Link>
			}
			handleClick={resetGameWithAllQuestions}
		/>
	);

	const numRemainingQuestions = getNumRemainingQuestions(questions, currentQuestionIdx);

	const getEndOfQuestionButtons = () => {
		if (!isInStudyMode) {
			return (
				<div className="Quiz-end-of-quiz-options">
					{restartQuizButton}
					{goToStudyMode}
				</div>
			);
		} else if (questionsExistInIncorrectCounter) {
			return (
				<div className="Quiz-end-of-quiz-options">
					{resetInStudyModeButton}
					{resetInStudyModeAllButton}
				</div>
			);
		} else {
			return (
				<div className="Quiz-end-of-quiz-options">
					{goToQuizModeButton}
					{resetInStudyModeAllButton}
				</div>
			);
		}
	};

	const getScoreMessage = (score) => {
		for (let [ lb, msg ] of SCORE_MESSAGES) {
			// console.log(lb);
			if (score >= lb) {
				return msg;
			}
		}
	};

	const getSummary = () => {
		if (!isInStudyMode) {
			// show score as a percentage
			const scorePercentage = Math.round(100 * correct / (incorrect + correct));
			return (
				<div className="Quiz-summary">
					<div className="Quiz-summary-msg">{getScoreMessage(scorePercentage)}</div>
					<div className="Quiz-summary-score">{scorePercentage}%</div>
				</div>
			);
		} else if (!questionsExistInIncorrectCounter) {
			return <h3>Nothing left to study!</h3>;
		} else {
			const incorrectCounterThisQuiz = getQuestionsWithIncorrectCounts(
				INCORRECT_COUNTER_LOCAL_STORAGE_KEY
			)[quizId];
			return (
				<QuestionHistorySummary
					title="Check out the questions you've missed"
					incorrectCounterThisQuiz={incorrectCounterThisQuiz}
					quizId={quizId}
				/>
			);
		}
	};

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
					isFlagsQuiz={quizId.startsWith('flag')}
					quizCategory={category}
					questionPrefix={questionPrefix}
					questionSuffix={questionSuffix}
					practiceMode={practiceMode}
					answerStatus={answerStatus}
					repeatCorrectAnswerMode={repeatCorrectAnswerMode}
					subsetCountsAsCorrect={subsetCountsAsCorrect}
					isMultiChoiceQuestion={isMultiChoice}
					handleAnswerSubmit={handleAnswerSubmit}
					questionsAll={questionsAll}
				/>
			);
		} else {
			return (
				<div className="Quiz-restart">
					{/* <i className="fa-solid fa-arrow-rotate-left" /> */}
					<i className="fa-solid arrow-left" />
					{getSummary()}
					{getEndOfQuestionButtons()}
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

	const handleMultiChoiceChange = (event, newSetting) => {
		if (newSetting !== null) {
			setIsMultiChoice(newSetting);
		}
	};

	const getMultiChoiceToggle = () => {
		return (
			<ToggleButtonGroup
				color="primary"
				value={isMultiChoice}
				exclusive
				onChange={handleMultiChoiceChange}
			>
				<ToggleButton className="Quiz-multi-choice-toggle" value={false}>
					Typing
				</ToggleButton>
				<ToggleButton className="Quiz-multi-choice-toggle" value={true}>
					Multi-Choice
				</ToggleButton>
			</ToggleButtonGroup>
		);
	};

	const handleQuitQuiz = () => {
		resetGame(false);
		navigate(quizProps.makeQuizRouteString());
	};

	const backButton = (
		<div className="Quiz-back-button">
			<i className="fa fa-thin fa-arrow-left" /> Back
		</div>
	);

	return (
		<div className="Quiz">
			{!isInStudyMode && numRemainingQuestions > 0 && currentQuestionIdx > 0 ? (
				<ConfirmationModal
					btnComponent={backButton}
					confirmationText="Are you sure?"
					confirmationSubText="This will reset your quiz score."
					acceptText="Yes"
					rejectText="No"
					handleAccept={handleQuitQuiz}
				/>
			) : (
				<div onClick={handleQuitQuiz}>{backButton}</div>
			)}
			<div className="Quiz-header">
				<h1>{quizProps.title}</h1>
				<div className="Quiz-switch-container">
					{isInStudyMode &&
						practiceModeAllowed &&
						getSwitch('Practice Mode', practiceMode, setPracticeMode)}
					{multiChoiceAllowed && typeAnswerAllowed && getMultiChoiceToggle()}
					{/* {getSwitch(
					'Incorrect Only',
					onlyPractiseIncorrect,
					setOnlyPractiseIncorrect,
					!questionsExistInIncorrectCounter // disabled - how to pass as parameter name?
				)} */}
				</div>
			</div>
			<ScoreCard correct={correct} incorrect={incorrect} remaining={numRemainingQuestions} />
			{getDisplay(numRemainingQuestions)}
		</div>
	);
}

export default Quiz;
