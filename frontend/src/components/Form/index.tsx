import React from 'react';
import { FormData } from '../../../../types';

type FormProps = {
	onSubmit: (e: React.FormEvent<HTMLFormElement>, data: FormData) => void;
	children?: React.ReactNode;
};

const Form: React.FC<FormProps> = ({
	onSubmit,
	children
}) => {
	const submit = (e: React.FormEvent<HTMLFormElement>) => {
		const target = e.target as HTMLFormElement;

		const name = target.name;
		const email = target.email.value;
		const phone = target.phone.value;
		const website = target.website.value;
		onSubmit(e , { name, email, phone, website });
	};

	return (
		<form onSubmit={e => submit(e)}>
			<div className='double-input-container'>
				<div>
					<p>Name: <sup>*</sup></p>
					<input className='name' type='text' name='name' required />
				</div>
				<div>
					<p>Email: <sup>*</sup></p>
					<input className='email' type='text' name='email' required />
				</div>
			</div>
			<div className='double-input-container'>
				<div>
					<p>Phone number:</p>
					<input className='phone' type='tel' name='phone' />
				</div>
				<div>
					<p>Website:</p>
					<input className='website' type='text' name='website' />
				</div>
			</div>
		
			{children}

			<div>
				<input className='submit button' type='submit' />
			</div>
		</form>
	);
};

export default Form;