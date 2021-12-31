import React, { useState } from 'react';
import GroundControl from '../../GroundControl';
import Form from '../../components/Form';
import content from '../../../content.json';
import { AnalyticsEngineClient } from 'mags-analytics';
import { FormData, quoteSubmissionData } from '../../../../types';

type PromptProps = {
	question: string;
	options: string[];
	onClick: (e: React.MouseEvent<HTMLAnchorElement>, data: { answer: string; }) => void;
};

const Prompt: React.FC<PromptProps> = ({
	question,
	options,
	onClick
}) => {
	const click = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const answer = e.currentTarget.querySelector('p')!.innerHTML;
		onClick(e, { answer });
	};

	return (
		<div>
			<p>{question}</p>
			{options.map((option: string, i: number) =>
				<a key={i} className='button' onClick={(e) => click(e)}><p>{option}</p></a>)
			}
		</div>
	);
};

type QuoteProps = {
	groundControl?: GroundControl;
}

const Quote: React.FC<QuoteProps> = ({
	groundControl
}) => {
	const [step, setStep] = useState<number>(0);
	const [showForm, setShowForm] = useState<boolean>(step + 1 >= content.quote.prompts.length);
	const [details, setDetails] = useState<{ [key: string]: string }>({});
	const prompts = content.quote.prompts;
	const activePrompt = prompts[step];

	const onClick = (e: React.MouseEvent<HTMLAnchorElement>, { answer }: { answer: string }) => {
		e.preventDefault();
	
		setDetails({
			...details,
			[activePrompt.keyword]: answer
		});

		if (step + 1 >= content.quote.prompts.length) return setShowForm(true);
		if (typeof activePrompt.skip !== 'undefined' &&
		activePrompt.skip.option === activePrompt.options.indexOf(answer) + 1) {
			if (step + 1 + activePrompt.skip.steps >= content.quote.prompts.length) return console.error('Step skip error');
			setStep(step + 1 + activePrompt.skip.steps);
		} else {
			setStep(step + 1);
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>, { name, email, phone, website }: FormData) => {
		e.preventDefault();
		const target = e.target as HTMLFormElement;

		const data: quoteSubmissionData = {
			details,
			... { name, email, phone, website }
		};

		const res = await fetch('/quoteSubmission', {
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(data)
		});

		console.log(res);
		setStep(0);
		target.reset();
		AnalyticsEngineClient.sendMetric(`Filled quote form as: ${name}`);
		groundControl?.decisionScreenRedirect();
	};

	return (
		<div className='quote'>
			<h2>{content.quote.title}</h2>
			{(!showForm)
				?
				<div className='questions-container'>
					<Prompt question={activePrompt.question} options={activePrompt.options} onClick={onClick} />
				</div>
				:
				<Form onSubmit={onSubmit} />
			}
		</div>
	);
};

export default Quote;