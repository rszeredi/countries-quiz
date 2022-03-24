import axios from 'axios';

const INCLUDE_TEST_QUIZ = false;
const COUNTRIES_API_URL =
	'https://restcountries.com/v3.1/all?fields=name,capital,unMember,continents,currencies';

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
		subsetCountsAsCorrect
	) {
		this.category = category;
		this.variant = variant;
		this.quizId = quizId;
		this.title = `${category}: ${variant}`;
		this.questionPrefix = questionPrefix;
		this.questionSuffix = questionSuffix;
		this.questionGetter = questionGetter;
		this.subsetCountsAsCorrect = subsetCountsAsCorrect;
	}
}

function getTestData() {
	return [
		{ question: 'Australia', answer: 'Canberra' },
		{ question: 'France', answer: 'Paris' },
		{ question: 'Spain', answer: 'Madrid' },
		{ question: 'Hungary', answer: 'Budapest' }
	];
}

async function getCountryQuizData(api_url, continent, countryDataParser) {
	const response = await axios.get(api_url);
	const countryData = parseCountryData(response.data, continent);
	return countryDataParser(countryData).sort(() => Math.random() - 0.5);
}

async function getCapitalCityQuizData(api_url, continent) {
	return getCountryQuizData(api_url, continent, capitalCityParser);
}

async function getCurrencyQuizData(api_url, continent) {
	return getCountryQuizData(api_url, continent, currencyParser);
}

function parseCountryData(data, continent) {
	return (
		data
			.filter((country) => country.unMember)
			// .filter((country) => country.name.common === 'Vatican City')
			.filter(
				(country) =>
					continent === 'all' || country.continents[0].toLowerCase() === continent
			)
	);
}

function capitalCityParser(countryData) {
	return countryData.map((country) => ({
		question: country.name.common,
		answer: country['capital'][0]
	}));
}

function currencyParser(countryData) {
	return countryData.map((country) => ({
		question: country.name.common,
		answer: Object.values(country['currencies'])[0].name
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
		() => getCapitalCityQuizData(COUNTRIES_API_URL, continent.toLowerCase())
	);
}

function makeCurrencyQuizProps(continent) {
	return new QuizProps(
		'Currencies',
		continent,
		`currencies-${continent.toLowerCase().replace(' ', '-')}`,
		'What is the official currency of ',
		'?',
		() => getCurrencyQuizData(COUNTRIES_API_URL, continent.toLowerCase()),
		true
	);
}

let quizzes = {
	'Capital Cities': continents.map((c) => makeCapitalCityQuizProps(c)),
	Currencies: continents.map((c) => makeCurrencyQuizProps(c))
};

if (INCLUDE_TEST_QUIZ) {
	quizzes['For Testing'] = [
		new QuizProps(
			'Capital Cities',
			'Test',
			'test',
			'What is the capital city of ',
			'?',
			getTestData
		)
	];
}

export default quizzes;
