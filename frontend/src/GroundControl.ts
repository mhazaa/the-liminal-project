import { getUrl, changeUrl } from './Router';
import { Pages } from '../../types';
import World from './World';
import { Vector2D } from './World/classes';
// import { AnalyticsEngineClient } from 'mags-analytics';
import isMobile from './modules/isMobile';

export default class GroundControl {
	world: World;

	constructor (world: World) {
		this.world = world;
		const url = getUrl();
		
		const page = (): Pages => (
			(url === '' ||
			url === 'home' ||
			url === 'about' ||
			url === 'contact' ||
			url === 'quote' ||
			url === 'work' ||
			url === 'decision')
				? url : ''
		);

		this.changePage(page());

		this.world.quoteSign.mesh.addClickEvent(() => this.changePage('quote'));
		this.world.workSign.mesh.addClickEvent(() => this.changePage('work'));
		this.world.portfolioSign.img.addClickEvent(() => console.log('portfolio cliked'));
	}

	public decisionScreenRedirect () {
		changeUrl('decision');
		setTimeout(() => changeUrl('home'), 4000);
	}

	public changePage (page: Pages) {
		(page === 'work')
			? this.world.scene.add(this.world.workPlanet)
			: this.world.scene.remove(this.world.workPlanet);

		(page === 'home') ? this.enterIntro() : this.exitIntro();

		changeUrl(page);
		this.changeWorld(page);
		const metricPage = (page === '') ? 'intro' : page;
		//AnalyticsEngineClient.sendMetric(`Viewed ${metricPage}`);
	}

	public enterIntro () {
		this.world.quoteSign.deactivate();
		this.world.workSign.deactivate();
	}

	public exitIntro () {
		this.world.quoteSign.activate();
		this.world.workSign.activate();
	}

	private changeWorld (page: Pages) {
		switch (page) {
		case '':
			this.world.camera.changeMode('locked', { position: new Vector2D(300, 300) });
			break;
		case 'home':
			(isMobile())
				? this.world.camera.changeMode('unlocked')
				: this.world.camera.changeMode('unlocked');
			break;
		case 'about':
			this.world.camera.changeMode('locked', { position: new Vector2D(360, 330) });
			break;
		case 'contact':
			this.world.camera.changeMode('locked', { position: new Vector2D(-360, -330) });
			break;
		case 'quote':
			this.world.camera.changeMode('locked', { position: new Vector2D(0, 800) });
			break;
		case 'work':
			this.world.camera.changeMode('work');
		}
	}
}