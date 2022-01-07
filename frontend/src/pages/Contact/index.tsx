import React, { useState } from 'react';
import GroundControl from '../../GroundControl';
import content from '../../../content.json';
import Select from './Select';
import Form from '../../components/Form';
import AnalyticsEngineClient from '@mhazaa/analytics-engine/client';
import { FormData, contactSubmissionData } from '../../../../types';

type ContactProps = {
	groundControl?: GroundControl;
};

const Contact: React.FC<ContactProps> = ({
	groundControl
}) => {
	const [reasonValue, setReasonValue] = useState<string>('');

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>, { name, email, phone, website }: FormData) => {
		e.preventDefault();
		const target = e.target as HTMLFormElement;
		const reason = reasonValue;
		const message = target.message.value;
		const data: contactSubmissionData = { name, email, phone, website, reason, message };

		const res = await fetch('/contactSubmission', {
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},			
			method: 'POST',
			body: JSON.stringify(data)
		});

		console.log(res);
		target.reset();
		AnalyticsEngineClient.sendMetric(`Filled contact form as: ${name}`);
		groundControl?.decisionScreenRedirect();
	};

	return (
		<div className='contact'>
			<h2>{content.contact.title}</h2>
			<Form onSubmit={onSubmit}>
				<div>
					<Select prompt='Reason for contacing' options={content.contact.reasons} setValue={setReasonValue} />
				</div>
				<div>
					<p>Your Message: <sup>*</sup></p>
					<textarea className='message' name='message' required />
				</div>
			</Form>
		</div>
	);
};

export default Contact;