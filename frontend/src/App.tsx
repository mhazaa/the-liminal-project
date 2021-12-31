import React, { useEffect } from 'react';
import { Router, Page } from './Router';
import { Home, About, Quote, Contact } from './pages';
import { Header, Footer } from './globals';
import GroundControl from './GroundControl';
import { AnalyticsEngineClient } from 'mags-analytics';
import content from '../content.json';
import './styles/stylesheet.scss';

type DecisionProps = {
	decision: string;
};

const Decision: React.FC<DecisionProps> = ({
	decision
}) => (
	<div className='page-container decision'>
		<p>{decision}</p>
	</div>
);

type AppProps = {
	groundControl?: GroundControl;
};

const App: React.FC<AppProps> = ({
	groundControl
}) => {
	useEffect(() => {
		AnalyticsEngineClient.connect();
	}, []);

	return (
		<div id='app'>
			<Router>
				<Header groundControl={groundControl} />

				<Page path='home'>
					<Home />
				</Page>

				<Page path='about'>
					<About />
				</Page>

				<Page path='contact'>
					<Contact groundControl={groundControl} />
				</Page>

				<Page path='quote'>
					<Quote groundControl={groundControl} />
				</Page>

				<Page path='work'>
				</Page>

				<Page path='decision'>
					<Decision decision={content.decision.quoteSubmission} />
				</Page>

				<Footer groundControl={groundControl} />
			</Router>
		</div>
	);
};

export default App;