/* TO DO:
css
details
import md for blog posts
active / deactivate, button control
(this.mode === 'work')
integrate ground control into router
import json as string, font
mobile view
npm run dev not running the app?
*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GroundControl from './GroundControl';

import World from './World';
const world = new World('frozen');
const groundControl = new GroundControl(world);

document.querySelector('#canvas-container')!.appendChild(world.renderer.domElement);

const loop = () => {
	world.loop();
	requestAnimationFrame(loop);
};
requestAnimationFrame(loop);
	
ReactDOM.hydrate(
	<React.StrictMode>
		<App groundControl={groundControl} />
	</React.StrictMode>,
	document.querySelector('#root')
);