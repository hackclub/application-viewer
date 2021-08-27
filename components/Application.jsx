


export const Application = ({ content }) => <>
	{content.map( section => <>
		<div>Header: {section.header}</div>
		{section.items.map(item => <>
			<div>Key: {item.key}</div>
			<div>Label: {item.label}</div>
			<div>Answer:</div>
		</>)}
	</>)}
</>