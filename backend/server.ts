import dotenv from 'dotenv';
import express from 'express';
import { resolve } from 'path';
import https from 'https';
import fs from 'fs';
import { AnalyticsEngine } from 'mags-analytics';
import MagsMongoDB, { Config } from 'mags-mongodb';
import router from './router';
dotenv.config();
const HTTPPORT = 80;
const HTTPSPORT = 443;
const app: express.Application = express();
app.use(express.json());
app.use(express.static( resolve('../frontend/build') ));
app.listen(HTTPPORT, () => console.log(`Listening to port: ${HTTPPORT}`));

app.use((req, res, next) => {
	(req.secure)
		? next()
		: res.redirect('https://' + req.headers.host + req.url);
});

const options = {
	key: fs.readFileSync('./certs/theliminalproject.com.key'),
	cert: fs.readFileSync('./certs/theliminalproject.com.crt'),
	ca: fs.readFileSync('./certs/theliminalproject.com.ca-bundle')
};

https.createServer(options, app).listen(HTTPSPORT, () => console.log(`Listening to port: ${HTTPSPORT}`));

const config: Config = {
	DBUSERNAME: process.env.DB_USERNAME || '',
	DBPASSWORD: process.env.DB_PASSWORD || '',
	DBNAME: process.env.DB_NAME || '',
	DBCLUSTERNAME: process.env.DB_CLUSTER_NAME || ''
};

const start = async () => {
	const db = new MagsMongoDB(config);
	await db.connect();

	const analyticsCollection = db.collection(process.env.ANALYTICS_COLLECTION || 'analytics');
	const contactSubmissionCollection = db.collection(process.env.CONTACT_SUBMISSIONS_COLLECTION || 'contact-submissions');
	const quoteSubmissionsCollection = db.collection(process.env.QUOTE_SUBMISSIONS_COLLECTION || 'quote-submissions');
	
	AnalyticsEngine.connect(analyticsCollection);
	AnalyticsEngine.routes(app);
	
	router(app, {
		contactSubmissionCollection,
		quoteSubmissionsCollection
	});
};

start();