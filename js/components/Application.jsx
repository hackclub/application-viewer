


export const Application = ({ template, content }) => <>
	{template.map( (section, i) => <div className="section" key={i}>
		<div className="section-title">{section.header}</div>
		{section.items.map((item, i) => <div key={i} className="item">
			<div className="question">{item.label}</div>
			<div>{content[item.key]}</div>
			<div className="item-key">airtable key: {item.key}</div>

		</div>)}
	</div>)}
</>