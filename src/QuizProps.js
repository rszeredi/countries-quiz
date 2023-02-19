import axios from 'axios';

const INCLUDE_TEST_QUIZ = false;
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
		multiChoiceAllowed,
		typeAnswerAllowed,
		isReverseQuiz
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
		this.multiChoiceAllowed = multiChoiceAllowed;
		this.typeAnswerAllowed = typeAnswerAllowed;
		this.isReverseQuiz = isReverseQuiz || false;
	}
	makeQuizRouteString() {
		const catPath = this.category.toLowerCase().replace(' ', '-');
		return '/' + catPath + '/' + this.makeVariantString();
	}

	makeVariantString() {
		return this.variant.replace(' ', '-').toLowerCase();
	}

	makeCategoryRouteString() {
		return '/' + this.category.toLowerCase().replace(' ', '-');
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

function capitalCityParser(countryData) {
	return countryData['capital'][0];
}

function currencyParser(countryData) {
	return Object.values(countryData['currencies'])[0].name;
}

function populationParser(countryData) {
	return countryData['population'];
}

function flagParser(countryData) {
	return countryData['flag'];
}

function questionMaker(countriesData, answerParser, reverse = false) {
	return countriesData.map((country) => {
		const countryName = country.name.common;
		const characteristic = answerParser(country); // todo: what if it's undefined??
		return !reverse
			? {
					question: countryName,
					answer: characteristic
				}
			: {
					question: characteristic,
					answer: countryName
				};
	});
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
		true,
		true
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
		true,
		true
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
		true,
		false
	);
}

function makeFlagQuizProps(continent, reverse) {
	getCountryQuizData('flag', continent.toLowerCase(), (data) =>
		questionMaker(data, flagParser)
	).then((x) => console.log('x', x));
	return !reverse
		? new QuizProps(
				'Flags',
				continent,
				`flags-${continent.toLowerCase().replace(' ', '-')}`,
				'What is the flag of ',
				'?',
				async () =>
					getCountryQuizData('flag', continent.toLowerCase(), (data) =>
						questionMaker(data, flagParser)
					),
				false,
				false,
				true,
				false
			)
		: new QuizProps(
				'Flags',
				continent,
				`flags-${continent.toLowerCase().replace(' ', '-')}-reversed`,
				"Name this flag's country: ",
				'',
				async () =>
					getCountryQuizData('flag', continent.toLowerCase(), (data) =>
						questionMaker(data, flagParser, reverse)
					),
				false,
				false,
				true,
				true,
				true
			);
}

let quizzes = {
	'Capital Cities:🌃': continents.map((c) => makeCapitalCityQuizProps(c)),
	'Currencies:💰': continents.map((c) => makeCurrencyQuizProps(c)),
	'Population:👥': continents.map((c) => makePopulationQuizProps(c)),
	'Flags:🇦🇺': continents.map((c) => makeFlagQuizProps(c, true))
};

if (INCLUDE_TEST_QUIZ) {
	quizzes['For Testing: 🧐'] = [
		new QuizProps(
			'Capital Cities',
			'Test',
			'test',
			'What is the capital city of ',
			'?',
			getTestData,
			false,
			true,
			true,
			true
		)
	];
}

export default quizzes;
