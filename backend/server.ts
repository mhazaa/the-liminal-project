import dotenv from 'dotenv';
import express from 'express';
import helmet from  'helmet';
import { resolve } from 'path';
import https from 'https';
import fs from 'fs';
import AnalyticsEngine from '@mhazaa/analytics-engine';
import DB, { Config } from '@mhazaa/mongo-controller';
import router from './router';

dotenv.config();
const HTTPPORT = 80;
const HTTPSPORT = 443;
const app: express.Application = express();
app.listen(HTTPPORT, () => console.log(`Listening to port: ${HTTPPORT}`));

app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
	if (req.secure) {
		next();
	} else {
		res.redirect('https://' + req.headers.host + req.url);
	}
});

app.use(express.static( resolve('../frontend/build') ));

const options = {
	key: fs.readFileSync('./certs/theliminalproject.com.key'),
	cert: fs.readFileSync('./certs/theliminalproject.com.crt'),
	ca: fs.readFileSync('./certs/theliminalproject.com.ca-bundle')
};

https.createServer(options, app).listen(HTTPSPORT, () => console.log(`Listening to port: ${HTTPSPORT}`));

const config: Config = {
	DBUSERNAME: process.env.DBUSERNAME || '',
	DBPASSWORD: process.env.DBPASSWORD || '',
	DBNAME: process.env.DBNAME || '',
	DBCLUSTERNAME: process.env.DBCLUSTERNAME || '',
	DBCLUSTERID: process.env.DBCLUSTERID || ''
};

const start = async () => {
	const db = new DB(config);
	await db.connect();

	const analyticsCollection = db.collection(process.env.ANALYTICS_COLLECTION || 'analytics');
	const contactSubmissionCollection = db.collection(process.env.CONTACT_SUBMISSIONS_COLLECTION || 'contact-submissions');
	const quoteSubmissionsCollection = db.collection(process.env.QUOTE_SUBMISSIONS_COLLECTION || 'quote-submissions');
	
	AnalyticsEngine.connectUsingCollection(analyticsCollection);
	AnalyticsEngine.routes(app);
	
	router(app, {
		contactSubmissionCollection,
		quoteSubmissionsCollection
	});
};

start();