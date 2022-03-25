export function getFilteredQuestions(allQuestions, onlyPractiseIncorrect, quizId, localStorageKey) {
	if (onlyPractiseIncorrect) {
		const incorrectCounts = getQuestionsWithIncorrectCounts(localStorageKey);
		const questionsFiltered = allQuestions.filter((q) =>
			Object.keys(incorrectCounts[quizId]).includes(q.question)
		);
		return questionsFiltered;
	} else {
		return allQuestions;
	}
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

	window.localStorage.setItem(localStorageKey, JSON.stringify(incorrectCounter));
}
