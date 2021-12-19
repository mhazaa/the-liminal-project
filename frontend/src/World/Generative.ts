import * as THREE from 'three';
import lerp from '../modules/lerp';
import Particles from './Particles';
import { Vector2D, Vector3D } from './classes';
import { CameraModes } from './';

const mouse = new Vector2D();

const hold = (time: number) => {
	return new Promise(res => {
		setTimeout(() => {
			res(null);
		}, time);
	});
};

class Camera extends THREE.PerspectiveCamera {
	initialZPosition = 300;
	rotationSpeed = new Vector3D(0.2, 0.2, 0.2);
	targetPosition = new Vector3D(0, 0, this.initialZPosition);
	lockedPosition = new Vector3D(0, 0, this.initialZPosition);
	positionalDamping = 0.01;
	focusPoint = new THREE.Vector3(0, 0, 0);
	mode: CameraModes;

	constructor (mode: CameraModes) {
		super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.position.z = this.initialZPosition;
		this.mode = mode;
		this.events();
	}

	events () {
		window.addEventListener('resize', () => {
			this.aspect = window.innerWidth / window.innerHeight;
			this.updateProjectionMatrix();
		});

		window.addEventListener('mousemove', () => {
			if (this.mode === 'tracking' || this.mode === 'work') this.updatePos(mouse);
		});
	}

	changeMode (mode: CameraModes, options?: { position: Vector2D }) {
		this.mode = mode;
		if (options?.position && mode === 'locked') {
			this.lockedPosition.x = options.position.x;
			this.lockedPosition.y = options.position.y;
		}
	}

	updatePos (mouse: Vector2D) {
		this.targetPosition.x = -mouse.x * this.rotationSpeed.x;
		this.targetPosition.y = mouse.y * this.rotationSpeed.y;
	}

	update () {
		this.lookAt(this.focusPoint);

		if (this.mode === 'unlocked') {
			this.position.x += ( mouse.x - this.position.x ) * 0.05;
			this.position.y += ( - mouse.y - this.position.y ) * 0.05;
			this.position.z = lerp(this.position.z, this.initialZPosition, this.positionalDamping);
		} else if (this.mode === 'frozen') {
			this.position.x = lerp(this.position.x, 0, this.positionalDamping);
			this.position.y = lerp(this.position.y, 0, this.positionalDamping);
			this.position.z = lerp(this.position.z, this.initialZPosition, this.positionalDamping);
		} else if (this.mode === 'tracking') {
			this.position.x = lerp(this.position.x, this.targetPosition.x, this.positionalDamping);
			this.position.y = lerp(this.position.y, this.targetPosition.y, this.positionalDamping);
			this.position.z = lerp(this.position.z, this.initialZPosition, this.positionalDamping);
		} else if (this.mode === 'work') {
			this.position.x = lerp(this.position.x, this.targetPosition.x, this.positionalDamping);
			this.position.y = lerp(this.position.y, this.targetPosition.y, this.positionalDamping);
			this.position.z = lerp(this.position.z, this.initialZPosition, this.positionalDamping);
			this.focusPoint.x = lerp(this.focusPoint.x, 400, this.positionalDamping);
			this.focusPoint.z = lerp(this.focusPoint.z, 400, this.positionalDamping);
		} else if (this.mode === 'locked') {
			this.position.x = lerp(this.position.x, this.lockedPosition.x, this.positionalDamping);
			this.position.y = lerp(this.position.y, this.lockedPosition.y, this.positionalDamping);
			this.position.z = lerp(this.position.z, this.initialZPosition, this.positionalDamping);
		}
	}
}

const animationSpeed = 0.0002;

class Line extends THREE.Mesh {
	width: number;
	height: number;
	animationSpeed: number;
	targetPosition: Vector2D;
	initialOpacity: number;
	targetOpacity: number;
	geometry: THREE.PlaneGeometry;
	material: THREE.MeshBasicMaterial;

	constructor (x = 0, y = 0, w = 1, h = 100, color = 0xffffff) {
		super();
		this.position.x = x;
		this.position.y = y;
		this.width = w;
		this.height = h;
		this.animationSpeed = animationSpeed;
		this.targetPosition = new Vector2D(this.position.x, this.position.y);
		this.initialOpacity = 0.2;
		this.targetOpacity = this.initialOpacity;
		this.geometry = new THREE.PlaneGeometry(this.width, this.height);
		this.material = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: this.initialOpacity
		});
		this.t();
	}

	t () {
		setInterval(() => {
			const randomInt = Math.floor(Math.random() * 100);
			if (randomInt !== 50) return;
			this.flash();
			setTimeout(() => this.unflash(), 1000);
		}, 1000);
	}

	flash () {
		this.targetOpacity = 1;
	}

	unflash () {
		this.targetOpacity = this.initialOpacity;
	}

	update () {
		this.position.x = lerp(this.position.x, this.targetPosition.x, this.animationSpeed);
		this.position.y = lerp(this.position.y, this.targetPosition.y, this.animationSpeed);
		this.material.opacity = lerp(this.material.opacity, this.targetOpacity, 0.05);
	}
}

class Plane extends THREE.Object3D {
	width: number;
	height: number;
	numOfLines: number;
	lineWidth: number;
	distanceBetweenLines: number;
	lines: Line[];
	targetPosition: Vector3D;
	targetRotation: Vector3D;
	animationSpeed: number;
	anims: { (): void }[];

	constructor () {
		super();
		this.width = 400;
		this.height = 400;
		this.numOfLines = 5;
		this.lineWidth = 0.5;
		this.distanceBetweenLines = this.width / ( this.numOfLines - this.lineWidth );
		this.lines = [];
		this.targetPosition = new Vector3D();
		this.targetRotation = new Vector3D();
		this.animationSpeed = animationSpeed;
		this.anims = [];

		/*const geometry = new THREE.BoxGeometry( 200, 200, 200 );
		const edges = new THREE.EdgesGeometry( geometry );
		const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.4
		}));
		this.add(line);*/


		//this.add(new Line(0, 0, this.width, this.height, 0xff0000));

		[...Array(this.numOfLines)].forEach(() => {
			const line = new Line(0, 0, this.lineWidth, this.height);
			this.lines.push(line);
			this.add(line);
		});
	}

	shape () {
		this.lines.forEach((line, i) => {
			const sub = ( (this.lines.length - 1) / 2 ) * ( this.distanceBetweenLines );
			line.targetPosition.x = i * this.distanceBetweenLines - sub;
		});
	}

	animate (callback: () => void) {
		this.anims.push(callback);
	}

	update () {
		this.anims.forEach(anim => anim());

		this.lines.forEach(line => {
			line.update();
		});

		this.position.x = lerp(this.position.x, this.targetPosition.x, this.animationSpeed);
		this.position.y = lerp(this.position.y, this.targetPosition.y, this.animationSpeed);
		this.position.z = lerp(this.position.z, this.targetPosition.z, this.animationSpeed);

		//this.rotation.x = lerp(this.rotation.x, this.targetRotation.x, this.animationSpeed);
		//this.rotation.y = lerp(this.rotation.y, this.targetRotation.y, this.animationSpeed);
		//this.rotation.z = lerp(this.rotation.z, this.targetRotation.z, this.animationSpeed);
	}
}

class Generative extends THREE.Object3D {
	planes: Plane[];
	numOfPlanes: number;

	constructor () {
		super();
		this.position.z = 0;
		this.planes = [];
		this.numOfPlanes = 80;

		[...Array(this.numOfPlanes)].forEach((obj, i) => {
			const plane = new Plane();
			this.planes.push(plane);
			plane.position.z = i * 20;
			plane.rotation.x = i * 20;
		});

		this.planes.forEach(plane => this.add(plane));
	}

	async animate (holdTime = 1000) {
		//await hold(5000);

		this.planes.forEach((plane, i) => {
			//const rotation = ( Math.PI / this.numOfPlanes ) * i;
			//plane.targetRotation.z = rotation;

			plane.animate(() => {
				const dir = (i % 2) ? 1 : -1;
				plane.position.x += 0.005 * dir;
				plane.rotation.z += 0.0000005 * i * dir;
			});
		});

		return;

		this.planes.forEach(plane => plane.shape());

		await hold(3000);

		this.planes.forEach((plane, i) => {
			//const rotation = ( Math.PI / this.numOfPlanes ) * i;
			//plane.targetRotation.z = rotation;

			plane.animate(() => {
				const dir = (i % 2) ? 1 : -1;
				plane.rotation.z += 0.00005 * i * dir;
			});
		});

		await hold(10000);

		this.planes.forEach((plane, i) => {
			plane.targetRotation.z = 0;
			const dir = (i % 2) ? 1 : -1;
			plane.targetPosition.x = i * 5 * dir;

			plane.targetPosition.z = i * 5;
		});

		return;

		await hold(1000);

		this.planes.forEach((plane, i) => {
			//const position = ( 400 / this.numOfPlanes ) * i;
			//plane.targetPosition.z = position;

			///plane.targetRotation.z = ( Math.PI / 2 ) * i;

			//plane.lines.forEach((line, i) => {
			//	line.targetPosition.x = i * 30;
			//});
		});

		return;

		this.animate();
	}

	update () {
		this.planes.forEach(plane => plane.update());
	}
}

class GenerativeSecond extends THREE.Object3D {
	planes: Plane[];
	numOfPlanes: number;

	constructor () {
		super();
		this.position.z = 0;
		this.planes = [];
		this.numOfPlanes = 80;

		[...Array(this.numOfPlanes)].forEach(() => {
			this.planes.push(new Plane());
		});

		this.planes.forEach(plane => this.add(plane));
	}

	async animate (holdTime = 1000) {
		await hold(holdTime);

		this.planes.forEach(plane => plane.shape());

		await hold(3000);

		this.planes.forEach((plane, i) => {
			//const rotation = ( Math.PI / this.numOfPlanes ) * i;
			//plane.targetRotation.z = rotation;

			plane.animate(() => {
				const dir = (i % 2) ? 1 : -1;
				plane.rotation.z += 0.00005 * i * dir;
			});
		});

		await hold(10000);

		this.planes.forEach((plane, i) => {
			plane.targetRotation.z = 0;
			const dir = (i % 2) ? 1 : -1;
			plane.targetPosition.x = i * 5 * dir;

			plane.targetPosition.z = i * 5;
		});

		return;

		await hold(1000);

		this.planes.forEach((plane, i) => {
			//const position = ( 400 / this.numOfPlanes ) * i;
			//plane.targetPosition.z = position;

			///plane.targetRotation.z = ( Math.PI / 2 ) * i;

			//plane.lines.forEach((line, i) => {
			//	line.targetPosition.x = i * 30;
			//});
		});

		return;

		this.animate();
	}

	update () {
		this.planes.forEach(plane => plane.update());
	}
}

class GenerativeCamera extends THREE.PerspectiveCamera {
	animationSpeed: number;
	focusObject: THREE.Object3D;

	constructor (focusObject: THREE.Object3D) {
		super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.focusObject = focusObject;
		this.animationSpeed = animationSpeed / 4;
		this.position.z = 600;
	}

	update () {
		//this.lookAt(this.focusObject.position);
		this.rotation.z += 0.003;
		this.position.z += 0.15;
		//this.position.y += 1;
	}
}

class GenerativeWorld {
	domContainer: HTMLElement;
	renderer: THREE.Renderer;
	scene: THREE.Scene;
	particles: Particles;
	windowHalfX = 0;
	windowHalfY = 0;
	generative: Generative;
	generativeScene: THREE.Scene;
	generativeCamera: GenerativeCamera;
	camera: Camera;

	constructor (domContainer: HTMLElement) {
		this.camera = new Camera('unlocked');
		this.domContainer = domContainer;
		this.renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.scene = new THREE.Scene();
		this.particles = new Particles();
		const focusObject = new THREE.Object3D();
		focusObject.position.set(this.particles.position.x, this.particles.position.y + 33, this.particles.position.z);

		this.setWindowHalf();
		this.events();

		this.generative = new GenerativeSecond();
		this.generative.animate();
		this.generativeScene = new THREE.Scene();
		this.generativeScene.add(this.particles);
		this.generativeCamera = new GenerativeCamera(this.generative);
		this.generativeScene.add(this.generative);
	}

	setWindowHalf () {
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
	}

	events () {
		document.body.style.touchAction = 'none';

		document.body.addEventListener('pointermove', e => {
			if ( e.isPrimary === false ) return;
			mouse.x = e.clientX - this.windowHalfX;
			mouse.y = e.clientY - this.windowHalfY;
		});

		window.addEventListener('mousemove', (e: MouseEvent) => {
			mouse.x = e.clientX - this.windowHalfX;
			mouse.y = e.clientY - this.windowHalfY;
		});

		window.addEventListener('resize', () => {
			this.setWindowHalf();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}

	loop () {
		this.camera.update();
		this.generative.update();
		this.generativeCamera.update();
		this.renderer.render(this.generativeScene, this.camera);
	}

	init () {
		this.domContainer.appendChild(this.renderer.domElement);
	}
}

export default GenerativeWorld;
