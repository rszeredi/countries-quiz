import axios from 'axios';

const INCLUDE_TEST_QUIZ = true;
const COUNTRIES_API_URL_BASE = 'https://restcountries.com/v3.1/all?fields=name,unMember,continents';

/*
questionGetter: returns a list of objects with question and answer properties, such that
the full question is: questionPrefix + question + questionSuffix
*/
class QuizProps {
	constructor(
		category,
		variant,
		quizId,
		questionPrefix,
		questionSuffix,
		questionGetter,
		subsetCountsAsCorrect,
		practiceModeAllowed,
		isMultiChoiceQuiz
	) {
		this.category = category;
		this.variant = variant;
		this.quizId = quizId;
		this.title = `${category}: ${variant}`;
		this.questionPrefix = questionPrefix;
		this.questionSuffix = questionSuffix;
		this.questionGetter = questionGetter;
		this.subsetCountsAsCorrect = subsetCountsAsCorrect;
		this.practiceModeAllowed = practiceModeAllowed;
		this.isMultiChoiceQuiz = isMultiChoiceQuiz;
	}
}

async function getTestData() {
	await new Promise((r) => setTimeout(r, 1000));
	return [
		{ question: 'Australia', answer: 'Canberra' },
		{ question: 'France', answer: 'Paris' },
		{ question: 'Spain', answer: 'Madrid' },
		{ question: 'Hungary', answer: 'Budapest' }
	];
}

async function getCountryQuizData(api_field, continent, countryDataParser) {
	const api_url = COUNTRIES_API_URL_BASE + `,${api_field}`;
	const response = await axios.get(api_url);
	const countryData = parseCountryData(response.data, continent);

	return countryDataParser(countryData).sort(() => Math.random() - 0.5);
}

function parseCountryData(data, continent) {
	return (
		data
			.filter((country) => country.unMember)
			// .filter((country) => country.name.common === 'Estonia')
			.filter(
				(country) =>
					continent === 'all' || country.continents[0].toLowerCase() === continent
			)
	);
}

// function capitalCityParser(countryData) {
// 	return countryData.map((country) => ({
// 		question: country.name.common,
// 		answer: country['capital'][0]
// 	}));
// }

// function currencyParser(countryData) {
// 	return countryData.map((country) => ({
// 		question: country.name.common,
// 		answer: Object.values(country['currencies'])[0].name
// 	}));
// }

// function populationParser(countryData) {
// 	return countryData.map((country) => ({
// 		question: country.name.common,
// 		answer: Object.values(country['population']) // todo: what if it's undefined??
// 	}));
// }

function capitalCityParser(countryData) {
	return countryData['capital'][0];
}

function currencyParser(countryData) {
	return Object.values(countryData['currencies'])[0].name;
}

function populationParser(countryData) {
	return countryData['population'];
}

function questionMaker(countriesData, answerParser) {
	return countriesData.map((country) => ({
		question: country.name.common,
		answer: answerParser(country) // todo: what if it's undefined??
	}));
}

const continents = [ 'Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania' ];

function makeCapitalCityQuizProps(continent) {
	return new QuizProps(
		'Capital Cities',
		continent,
		`capital-cities-${continent.toLowerCase().replace(' ', '-')}`,
		'What is the capital city of ',
		'?',
		async () =>
			getCountryQuizData('capital', continent.toLowerCase(), (data) =>
				questionMaker(data, capitalCityParser)
			),
		false,
		true,
		false
	);
}

function makeCurrencyQuizProps(continent) {
	return new QuizProps(
		'Currencies',
		continent,
		`currencies-${continent.toLowerCase().replace(' ', '-')}`,
		'What is the official currency of ',
		'?',
		async () =>
			getCountryQuizData('currencies', continent.toLowerCase(), (data) =>
				questionMaker(data, currencyParser)
			),
		true,
		true,
		false
	);
}

function makePopulationQuizProps(continent) {
	return new QuizProps(
		'Population',
		continent,
		`population-${continent.toLowerCase().replace(' ', '-')}`,
		'What is the population of ',
		'?',
		async () =>
			getCountryQuizData('population', continent.toLowerCase(), (data) =>
				questionMaker(data, populationParser)
			),
		false,
		false,
		true
	);
}

let quizzes = {
	'Capital Cities': continents.map((c) => makeCapitalCityQuizProps(c)),
	Currencies: continents.map((c) => makeCurrencyQuizProps(c)),
	Population: continents.map((c) => makePopulationQuizProps(c))
};

if (INCLUDE_TEST_QUIZ) {
	quizzes['For Testing'] = [
		new QuizProps(
			'Capital Cities',
			'Test',
			'test',
			'What is the capital city of ',
			'?',
			getTestData,
			false,
			true,
			false
		)
	];
}

export default quizzes;
