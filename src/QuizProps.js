import axios from 'axios';

const COUNTRIES_API_URL =
	'https://restcountries.com/v3.1/all?fields=name,capital,unMember,continents';

/*
questionGetter: returns a list of objects with question and answer properties, such that
the full question is: questionPrefix + question + questionSuffix
*/
class QuizProps {
	constructor(title, route, questionPrefix, questionSuffix, questionGetter) {
		this.title = title;
		this.route = route;
		this.questionPrefix = questionPrefix;
		this.questionSuffix = questionSuffix;
		this.questionGetter = questionGetter;
	}
}

function getTestData() {
	return [
		{ question: 'Australia', answer: 'Canberra' },
		{ question: 'France', answer: 'Paris' },
		{ question: 'Spain', answer: 'Madrid' },
		{ question: 'Malaysia', answer: 'Kuala Lumpur' },
		{ question: 'Hungary', answer: 'Budapest' }
	];
}

async function getCapitalCityQuizData(api_url, continent) {
	const response = await axios.get(api_url);
	const countryData = parseCountryData(response.data, continent);
	return countryData.sort(() => Math.random() - 0.5);
}

function parseCountryData(data, continent, unMembersOnly = true) {
	return (
		data
			.filter((country) => !unMembersOnly || country.unMember)
			// .filter((country) => country.name.common === 'Vatican City')
			.filter(
				(country) =>
					continent === 'all' || country.continents[0].toLowerCase() === continent
			)
			.map((country) => ({
				question: country.name.common,
				answer: country.capital[0]
			}))
	);
}

const quizzes = [
	// new QuizProps(
	// 	'Capital Cities: test',
	// 	'capital-cities-test',
	// 	'What is the capital city of ',
	// 	'?',
	// 	getTestData
	// ),
	new QuizProps(
		'Capital Cities: Europe',
		'capital-cities-europe',
		'What is the capital city of ',
		'?',
		() => getCapitalCityQuizData(COUNTRIES_API_URL, 'europe')
	),
	new QuizProps(
		'Capital Cities: Asia',
		'capital-cities-asia',
		'What is the capital city of ',
		'?',
		() => getCapitalCityQuizData(COUNTRIES_API_URL, 'asia')
	),
	new QuizProps(
		'Capital Cities: Africa',
		'capital-cities-africa',
		'What is the capital city of ',
		'?',
		() => getCapitalCityQuizData(COUNTRIES_API_URL, 'africa')
	),
	new QuizProps(
		'Capital Cities: North America',
		'capital-cities-north-america',
		'What is the capital city of ',
		'?',
		() => getCapitalCityQuizData(COUNTRIES_API_URL, 'north america')
	),
	new QuizProps(
		'Capital Cities: South America',
		'capital-cities-south-america',
		'What is the capital city of ',
		'?',
		() => getCapitalCityQuizData(COUNTRIES_API_URL, 'south america')
	),
	new QuizProps(
		'Capital Cities: Oceania',
		'capital-cities-oceania',
		'What is the capital city of ',
		'?',
		() => getCapitalCityQuizData(COUNTRIES_API_URL, 'oceania')
	)
];

export default quizzes;
