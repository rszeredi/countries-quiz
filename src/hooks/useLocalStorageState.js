import { useState, useEffect } from 'react';

function useLocalStorageState(key, defaultVal) {
	// initialize a piece of state, based off of value in localStorage (or default)
	const [ state, setState ] = useState(() => {
		let val;
		try {
			val = JSON.parse(window.localStorage.getItem(key) || String(defaultVal));
		} catch (e) {
			val = defaultVal;
		}
		return val;
	});

	// use useEffect to update localStorage when the state changes
	// this listens for changes on state
	useEffect(
		() => {
			window.localStorage.setItem(key, JSON.stringify(state));
		},
		[ state ]
	);

	return [ state, setState ];
}
export default useLocalStorageState;
