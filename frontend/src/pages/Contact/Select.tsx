import React, { useState } from 'react';

type SelectProps = {
	prompt: string;
	options: string[];
	setValue: (newValuesw: string) => void;
};

const Select: React.FC<SelectProps> = ({
	prompt,
	options,
	setValue
}) => {
	const [open, setOpen] = useState<boolean>(false);
	const [selected, setSelected] = useState<string>('');

	const onOptionClick = (option: string) => {
		setValue(option);
		setOpen(false);
		setSelected(option);
	};

	const translate = (value: number) => ({ transform: `translateY(${value}%)` });

	return (
		<div className='select'>	
			<a className={'button prompt'} onClick={() => setOpen(!open)}>
				<div className={`arrow-down ${open ? 'flipped' : ''}`}></div>
				<p>{selected.length === 0 || open ? prompt : selected}</p>
			</a>
			<div className='options-container'>
				{options.map((option, i) => (
					<a
						key={option}
						className={`button option ${selected === option ? 'selected' : ''}`}
						style={open ? translate(100 * (i + 1)) : translate(0)}
						onClick={() => onOptionClick(option)}>
						<p>{option}</p>
					</a>
				))}
			</div>
		</div>
	);
};

export default Select;