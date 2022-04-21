export const INCORRECT_COUNTER_LOCAL_STORAGE_KEY = `incorrectCounter`;

export function getFilteredQuestions(allQuestions, onlyPractiseIncorrect, quizId, localStorageKey) {
	if (onlyPractiseIncorrect) {
		const incorrectCounts = getQuestionsWithIncorrectCounts(localStorageKey);
		if (incorrectCounts && incorrectCounts[quizId]) {
			const questionsFiltered = allQuestions.filter((q) =>
				Object.keys(incorrectCounts[quizId]).includes(q.question)
			);
			return questionsFiltered;
		}
	}

	// if not in only practising incorrect, or if there are currently no tracked incorrect questions
	// then return all of the original questions
	return allQuestions;
}

export function getQuestionsWithIncorrectCounts(localStorageKey) {
	let incorrectCounter;
	try {
		incorrectCounter = JSON.parse(window.localStorage.getItem(localStorageKey) || '{}');
	} catch (e) {
		incorrectCounter = {};
	}
	return incorrectCounter;
}

export function existsQuestionsWithIncorrectCounts(quizId, localStorageKey) {
	const incorrectCounterQuiz = getQuestionsWithIncorrectCounts(localStorageKey)[quizId];

	if (incorrectCounterQuiz && Object.keys(incorrectCounterQuiz).length > 0) {
		return true;
	} else {
		return false;
	}
}

export function getCurrentQuestion(questions, currentQuestionIdx) {
	const { question, answer } = questions[currentQuestionIdx];
	return { questionMainText: question, answer: answer };
}

export function getNumRemainingQuestions(questions, currentQuestionIdx) {
	return questions.length - currentQuestionIdx;
}

export function updateScore(
	answerIsCorrect,
	currentCorrect,
	setCorrect,
	currentIncorrect,
	setIncorrect
) {
	if (answerIsCorrect) {
		setCorrect(currentCorrect + 1); // does this actually work (ie. is currentCorrect guaranteed to be updated?) Consider creating an "updateScore" custom hook
		// this.setState((curSt) => ({ correct: curSt.correct + 1 }));
	} else {
		setIncorrect(currentIncorrect + 1);
	}
}

export function updateIncorrectCount(question, delta, quizId, localStorageKey) {
	const incorrectCounter = getQuestionsWithIncorrectCounts(localStorageKey);

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

	// console.log('incorrectCounter[quizId]', incorrectCounter[quizId]);
	writeIncorrectCounterToLocalStorage(incorrectCounter);
}

function writeIncorrectCounterToLocalStorage(incorrectCounter) {
	window.localStorage.setItem(
		INCORRECT_COUNTER_LOCAL_STORAGE_KEY,
		JSON.stringify(incorrectCounter)
	);
}
