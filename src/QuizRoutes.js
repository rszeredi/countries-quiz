import React from 'react';
import { Route, Routes } from 'react-router';
import Quiz from './Quiz';
import QuizMenu from './QuizMenu';

export default function QuizRoutes() {
	return (
		<Routes>
			<Route path="/" element={<QuizMenu />} />
			<Route path="/capital-cities-europe" element={<Quiz continent="europe" />} />
			<Route path="/capital-cities-africa" element={<Quiz continent="africa" />} />
			<Route path="/capital-cities-asia" element={<Quiz continent="asia" />} />
			<Route path="/capital-cities-test" element={<Quiz continent="test" />} />
		</Routes>
	);
}
