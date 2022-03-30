import React from 'react';
import './ActionButton.css';

export default function ActionButton(props) {
	const { btnContent, extraClassNames, handleClick } = props;
	return (
		<div>
			<button className={'ActionButton ' + extraClassNames} onClick={handleClick}>
				{btnContent}
			</button>
		</div>
	);
}
