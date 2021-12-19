/*class Plane extends THREE.Object3D {
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

	animate (callback: Function) {
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
}*/
