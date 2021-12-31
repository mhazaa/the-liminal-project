import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import Particles from './Particles';
import lerp from '../modules/lerp';
import { Vector2D, Vector3D } from './classes';
import content from '../../content.json';
import planet from '../assets/models/lowpoly.glb';
import caseStudyImg from '../assets/imgs/cosmicchat.jpg';
//import ubuntoBoldFont from '../assets/fonts/ubunto_bold.json';

/*import(
	'../assets/fonts/ubunto_bold.json'
).then(({default: jsonMenu}) => {
	console.log('my menu: ', jsonMenu);
});*/

const ubuntoBoldFontPath = './assets/fonts/ubunto_bold.json';

export type CameraModes = 'frozen' | 'locked' | 'unlocked' | 'tracking' | 'work' | 'mobile';

const COLORS = {
	white: 0xffffff,
	yellow: 0xffa14e,
	brown: 0x3a2c13,
};

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const fontLoader = new FontLoader();
const mouse = new Vector2D();

class Raycaster extends THREE.Raycaster {
	mouse = new THREE.Vector2();
	children: THREE.Object3D[] = [];
	intersectedObjects: THREE.Intersection[] = [];
	hoveredObject: DimmableMesh | null = null;

	constructor () {
		super();
		this.events();
	}

	events () {
		window.addEventListener('mousemove', (e) => {
			this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
		});

		window.addEventListener('click', () => {
			if (this.hoveredObject && this.hoveredObject.clickable)
				this.hoveredObject.onClick();
		});
	}

	addChild (child: THREE.Object3D) {
		this.children.push(child);
	}

	resetAllChildrenOpacity () {
		this.children.forEach(child => {
			//@ts-ignore
			if (child.isDimmableMesh && child.targetOpacity !== 1) child.changeOpacity(1);
		});
	}

	update (camera: Camera) {
		this.setFromCamera(this.mouse, camera);
		this.resetAllChildrenOpacity();
		document.body.style.cursor = 'auto';
		
		this.intersectedObjects = this.intersectObjects(this.children);
		if (this.intersectedObjects.length === 0) return this.hoveredObject = null;
		const intersectedObject = this.intersectedObjects[0].object;
		//@ts-ignore
		(intersectedObject.isDimmableMesh) ? this.hoveredObject =  intersectedObject : this.hoveredObject = null;
		if (!this.hoveredObject) return;

		if (this.hoveredObject.clickable) {
			document.body.style.cursor = 'pointer';
			if (this.hoveredObject.targetOpacity !== this.hoveredObject.hoverOpacity)
				this.hoveredObject.changeOpacity(this.hoveredObject.hoverOpacity);
		}
	}
}

class Camera extends THREE.PerspectiveCamera {
	initialZPosition = 100;
	rotationDamping = new Vector3D(0.2, 0.2, 0.2);
	targetPosition = new Vector3D(0, 0, this.initialZPosition);
	positionalDamping = 0.01;
	focusPoint = new THREE.Vector3(0, 33, 0);
	targetFocusPoint = new THREE.Vector3(0, 33, 0);
	focusPointDamping = 0.04;
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

		const h1 = document.createElement('h1');
		//document.body.prepend(h1);
		h1.innerHTML = 'x: ';

		window.addEventListener('devicemotion', (e: any) => {
			let x = e.accelerationIncludingGravity.x;
			x = Math.round(x * 10) / 10;
			x = x * 15;
			h1.innerHTML = x.toString();
			let y = e.accelerationIncludingGravity.y;
			y = Math.round(y * 10) / 10;
			y = y * 15;
			this.targetPosition.x = x;
			this.targetPosition.y = y;
		});
	}

	updatePos (mouse: Vector2D) {
		this.targetPosition.x = -mouse.x * this.rotationDamping.x;
		this.targetPosition.y = mouse.y * this.rotationDamping.y;
	}

	changeMode (mode: CameraModes, options?: { position: Vector2D }) {
		this.mode = mode;

		if (options?.position && this.mode === 'locked') {
			this.targetPosition.x = options.position.x;
			this.targetPosition.y = options.position.y;
		}

		if (this.mode === 'frozen') {
			this.targetPosition.x = 0;
			this.targetPosition.y = 0;
		}

		if (this.mode === 'mobile') {
			this.targetPosition.x = 0;
			this.targetPosition.y = 0;
		}

		if (this.mode === 'work') {
			this.targetPosition.z = 450;
			setTimeout(() => {
				this.targetFocusPoint.set(0, 50, 600);
			}, 700);
		} else {
			this.targetPosition.z = this.initialZPosition;
			this.targetFocusPoint.set(0, 33, 0);
		}
	}

	update () {
		this.lookAt(this.focusPoint);

		this.focusPoint.x = lerp(this.focusPoint.x, this.targetFocusPoint.x, this.focusPointDamping);
		this.focusPoint.y = lerp(this.focusPoint.y, this.targetFocusPoint.y, this.focusPointDamping);
		this.focusPoint.z = lerp(this.focusPoint.z, this.targetFocusPoint.z, this.focusPointDamping);

		if (this.mode === 'unlocked') {
			this.position.x += ( mouse.x - this.position.x ) * 0.05;
			this.position.y += ( - mouse.y - this.position.y ) * 0.05;
		} else {
			this.position.x = lerp(this.position.x, this.targetPosition.x, this.positionalDamping);
			this.position.y = lerp(this.position.y, this.targetPosition.y, this.positionalDamping);
		}

		this.position.z = lerp(this.position.z, this.targetPosition.z, this.positionalDamping);
	}
}

class DimmableMesh extends THREE.Mesh {
	isDimmableMesh = true;
	targetOpacity = 1;
	hoverOpacity = 0.3;
	opacityDamping = 0.1;
	clickable: boolean;
	clickEvents: { (): void; } [] = [];

	constructor (on = true) {
		super();
		this.clickable = on;
	}

	addClickEvent (event: () => void) {
		this.clickEvents.push(event);
	}

	onClick () {
		this.clickEvents.forEach(clickEvent => clickEvent());
	}

	changeOpacity (targetOpacity: number) {
		this.targetOpacity = targetOpacity;
	}

	updateOpacity () {
		//@ts-ignore
		this.material.opacity = lerp(this.material.opacity, this.targetOpacity, this.opacityDamping);
	}
}

class Sign extends THREE.Object3D {
	signTitle: string;
	plackWidth = 3;
	plackHeight = 12;
	fullWidth = 18;
	fullHeight = 25;
	positionY = this.fullHeight * 2;
	depth = 2;
	mesh: DimmableMesh;
	textMesh: TextMesh;

	constructor (signTitle: string) {
		super();
		this.signTitle = signTitle;
		const shape = new THREE.Shape();
		shape.moveTo(- this.fullWidth, 0);
		shape.lineTo(this.fullWidth, 0);
		shape.lineTo(this.fullWidth + this.fullWidth * 0.5, - this.plackHeight/2);
		shape.lineTo(this.fullWidth, - this.plackHeight);
		shape.lineTo(this.plackWidth, - this.plackHeight);
		shape.lineTo(this.plackWidth, - this.fullHeight);
		shape.lineTo(0, - this.fullHeight);
		shape.lineTo(0, - this.plackHeight);
		shape.lineTo(- this.fullWidth, - this.plackHeight);
		shape.lineTo(- this.fullWidth, 0);

		const extrudeSettings = {
			steps: 1,
			depth: this.depth,
			bevelEnabled: false,
			bevelThickness: 1,
			bevelSize: 1,
			bevelOffset: 0,
			bevelSegments: 1
		};

		this.mesh = new DimmableMesh();
		this.mesh.position.y = this.positionY;
		this.mesh.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
		this.mesh.material = new THREE.MeshLambertMaterial({ color: COLORS.brown });
		this.mesh.material.transparent = true;

		this.textMesh = new TextMesh(this.signTitle, 3.5);
		this.textMesh.position.x = - this.fullWidth;
		this.textMesh.position.y = this.positionY - 8;
		this.textMesh.position.z = this.depth;

		this.add(this.mesh);
		this.add(this.textMesh);
	}

	activate () {
		this.mesh.clickable = true;
	}

	deactivate () {
		this.mesh.clickable = false;
	}

	update () {
		this.mesh.updateOpacity();
	}
}

class TextMesh extends THREE.Mesh {
	text = '';
	fontSize = 9;

	constructor (text = '', fontSize = 9) {
		super();
		this.text = text;
		this.fontSize = fontSize;
		
		this.material = new THREE.MeshBasicMaterial({ color: COLORS.white });
		fontLoader.load(ubuntoBoldFontPath, font => {
			this.geometry = new TextGeometry(this.text.toUpperCase(), {
				font: font,
				size: this.fontSize,
				height: 1
			});
		});
	}
}

class PortfolioSign extends THREE.Object3D {
	signTitle: string;
	text: TextMesh;
	circleRadius = 40;
	planeWidth = 3;
	planeHeight = 50;
	pivotY = 40;
	mesh: THREE.Mesh;
	plane: THREE.Mesh;
	img: DimmableMesh;

	constructor (signTitle: string) {
		super();
		this.signTitle = signTitle;

		this.text = new TextMesh(this.signTitle, 9);
		this.text.position.x = -40;
		this.text.position.y = this.planeHeight + this.pivotY + 40;

		this.mesh = new THREE.Mesh();
		this.mesh.position.y = this.planeHeight + this.pivotY;
		this.mesh.geometry = new THREE.CircleGeometry(this.circleRadius, this.circleRadius * 2);
		this.mesh.material = new THREE.MeshLambertMaterial({ color: COLORS.brown, side: THREE.DoubleSide });
		this.mesh.material.transparent = true;

		this.img = new DimmableMesh();
		this.img.geometry = new THREE.CircleGeometry(this.circleRadius - 2, this.circleRadius * 2);
		this.img.material = new THREE.MeshBasicMaterial({
			map: textureLoader.load(caseStudyImg)
		});
		this.img.position.y = this.planeHeight + this.pivotY;
		this.img.position.z = 0.5;
		this.img.material.transparent = true;

		this.plane = new THREE.Mesh();
		this.plane.geometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight);
		this.plane.material = new THREE.MeshLambertMaterial({ color: COLORS.brown, side: THREE.DoubleSide });
		this.plane.position.y = this.pivotY;

		this.add(this.text);
		this.add(this.mesh);
		this.add(this.plane);
		this.add(this.img);
	}

	update () {
		this.img.updateOpacity();
	}
}

class Planet extends THREE.Object3D {
	gltfScene: THREE.Scene | undefined;
	size = 20;

	constructor (size = 20) {
		super();
		this.size = size;

		gltfLoader.load(planet, (gltf: any) => {
			this.gltfScene = gltf.scene;
			if (!this.gltfScene) return;
			this.add(this.gltfScene);
			this.gltfScene.scale.set(this.size, this.size, this.size);
		}, xhr => {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		}, error => {
			console.error(error);
		});
	}
}

class MainPlanet extends Planet {
	light: THREE.PointLight = new THREE.PointLight(COLORS.yellow, 15, 110);
	targetRotation = new Vector2D();
	rotationSpeed = new Vector2D(0.004, 0.0005);
	rotationalDamping = 0.1;

	constructor () {
		super();
		this.light.position.set(50, 50, 50);
		this.add(this.light);
		this.events();
	}

	events () {
		window.addEventListener('mousemove', () => this.updatePos(mouse));
	}

	updatePos (mouse: Vector2D) {
		this.targetRotation.x = mouse.y * this.rotationSpeed.y;
		this.targetRotation.y = mouse.x * this.rotationSpeed.x;
	}

	update () {
		this.rotation.x = lerp(this.rotation.x, this.targetRotation.x, this.rotationalDamping);
		this.rotation.y = lerp(this.rotation.y, this.targetRotation.y, this.rotationalDamping);
	}
}

class World {
	renderer: THREE.Renderer;
	scene: THREE.Scene;
	homePlanet: MainPlanet;
	particles: Particles;
	camera: Camera;
	quoteSign: Sign;
	workSign: Sign;
	windowHalfX = 0;
	windowHalfY = 0;
	raycaster: Raycaster;
	workPlanet: MainPlanet;
	portfolioSign: PortfolioSign;

	constructor (mode: CameraModes = 'unlocked') {
		this.renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.scene = new THREE.Scene();
		this.raycaster = new Raycaster();
		this.homePlanet = new MainPlanet();
		this.particles = new Particles();
		this.camera = new Camera(mode);
		this.quoteSign = new Sign(content.quote.title.toUpperCase());
		this.workSign = new Sign(content.work.title.toUpperCase());
		this.quoteSign.rotation.z = Math.PI / 5;
		this.workSign.rotation.z = - Math.PI / 5;
		this.quoteSign.textMesh.position.x = - this.quoteSign.fullWidth + 4;
		this.workSign.mesh.scale.x = -1;
		this.homePlanet.add(this.quoteSign);
		this.homePlanet.add(this.workSign);
		this.scene.add(this.homePlanet);
		this.scene.add(this.particles);
		this.raycaster.addChild(this.quoteSign.mesh);
		this.raycaster.addChild(this.workSign.mesh);
		this.setWindowHalf();
		this.events();
		this.generateOtherPlanets();

		this.workPlanet = new MainPlanet();
		this.portfolioSign = new PortfolioSign('Cosmic Chat');
		this.raycaster.addChild(this.portfolioSign.img);
		this.portfolioSign.rotation.z = Math.PI / 5;
		const portfolioSignTwo = new PortfolioSign('Cosmic Chat');
		portfolioSignTwo.rotation.z = -Math.PI / 5;
		this.raycaster.addChild(portfolioSignTwo.img);
		this.workPlanet.add(this.portfolioSign);
		this.workPlanet.add(portfolioSignTwo);
		this.workPlanet.position.set(0, 0, 600);
		this.workPlanet.rotation.y = Math.PI;
		this.scene.add(this.workPlanet);

		const globalLight = new THREE.DirectionalLight(COLORS.yellow, 3);
		globalLight.position.y = 5000;
		this.scene.add(globalLight);
	}

	generateOtherPlanets () {
		const pos = { low: -500, high: 500 };
		const rot = { low: 0, high: 3 };
		const numOfPlanets = 30;

		const randomInt = (min: number, max: number) => {
			return Math.floor(Math.random() * (max - min + 1) + min);
		};

		for (let i = 0; i < numOfPlanets; i++) {
			const size = randomInt(0, 150) *  0.1;
			const planet = new Planet(size);

			planet.position.set(
				randomInt(pos.low, pos.high),
				randomInt(pos.low, pos.high),
				randomInt(pos.low, pos.high)
			);

			planet.rotation.set(
				randomInt(rot.low, rot.high),
				randomInt(rot.low, rot.high),
				randomInt(rot.low, rot.high)
			);

			this.scene.add(planet);
		}
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
		this.homePlanet.update();
		this.quoteSign.update();
		this.workSign.update();
		this.portfolioSign.update();
		this.particles.update();
		this.camera.update();
		this.raycaster.update(this.camera);
		this.renderer.render(this.scene, this.camera);
	}
}

export default World;
