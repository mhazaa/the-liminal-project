import React from 'react';
import ssr from '../ssr';
import { resolve } from 'path';
import { Application } from 'express';
import { Collection } from 'mags-mongodb';
import App from '../../frontend/src/App';
import { contactSubmissionData, quoteSubmissionData } from '../../types';

interface Collections {
	contactSubmissionCollection: Collection;
	quoteSubmissionsCollection: Collection;
}

export default (app: Application, collections: Collections): void => {
	app.get('*', async (_req, res) => {
		try {
			const data = await ssr(resolve('../frontend/build/index.html'), <App />);
			return res.status(200).send(data);
		} catch (error) {
			console.error(error);
			return res.status(500).send(error);
		}
	});

	app.post('/contactSubmission', async (req, res) => {
		const reqData: contactSubmissionData = req.body;
		const resData = await collections.contactSubmissionCollection.insertOne(reqData);
		console.log(reqData);
		res.status(200).send(resData);

	});

	app.post('/quoteSubmission', async (req, res) => {
		const reqData: quoteSubmissionData = req.body;
		const resData = await collections.quoteSubmissionsCollection.insertOne(reqData);
		console.log(reqData);
		res.status(200).send(resData);
	});

	/*app.get('/', (_req, res) => {
		res.sendFile(resolve(__dirname, 'client/build'));
	});

	app.get('/home', (_req, res) => {
		res.redirect('/');
	});*/
};