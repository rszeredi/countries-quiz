import useLocalStorageState from './useLocalStorageState';

class QuizState {
	constructor(
		quizId,
		questionsAll,
		questions,
		currentQuestionIdx,
		correct,
		incorrect,
		practiceMode
	) {
		this.quizId = quizId;
		this.questionsAll = questionsAll;
		this.questions = questions;
		this.currentQuestionIdx = currentQuestionIdx;
		this.correct = correct;
		this.incorrect = incorrect;
		this.practiceMode = practiceMode;
	}
}

export default function useQuizState(quizId, pickUpWhereLeftOff) {
	const emptyQuizState = new QuizState(quizId, [], [], 0, 0, 0, false, false);
	const [ quizState, setQuizState ] = useLocalStorageState(
		quizId,
		emptyQuizState,
		pickUpWhereLeftOff
	);

	// reset quizState if not picking up where we left off

	const setProperty = (propertyName, newVal) => {
		setQuizState((currQuizState) => ({ ...currQuizState, [propertyName]: newVal }));
	};

	const setQuestionsAll = (newVal) => setProperty('questionsAll', newVal);
	const setQuestions = (newVal) => setProperty('questions', newVal);
	const setCurrentQuestionIdx = (newVal) => setProperty('currentQuestionIdx', newVal);
	const setCorrect = (newVal) => setProperty('correct', newVal);
	const setIncorrect = (newVal) => setProperty('incorrect', newVal);
	const setPracticeMode = (newVal) => setProperty('practiceMode', newVal);
	return {
		quizState,
		setQuestionsAll,
		setQuestions,
		setCurrentQuestionIdx,
		setCorrect,
		setIncorrect,
		setPracticeMode
	};
}
