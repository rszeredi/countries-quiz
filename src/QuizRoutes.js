import React from 'react';
import { Route, Routes } from 'react-router';
import Quiz from './Quiz';
import QuizMenu from './QuizMenu';

import quizzes from './QuizProps';

export default function QuizRoutes() {
	console.log(quizzes);
	return (
		<Routes>
			<Route path="/" element={<QuizMenu />} />
			{quizzes.map((quiz) => {
				return (
					<Route
						path={'/' + quiz.route}
						element={<Quiz quizProps={quiz} />}
						key={quiz.route}
					/>
				);
			})}
		</Routes>
	);
}
