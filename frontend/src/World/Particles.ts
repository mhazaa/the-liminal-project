import * as THREE from 'three';
import textureSprite from '../assets/textureSprites/circle.png';

const textureLoader = new THREE.TextureLoader();

class Particles extends THREE.Scene {
	scene: THREE.Scene;
	geometry: THREE.BufferGeometry;
	vertices: any[];
	sprite: any;
	materials: THREE.PointsMaterial[];
	parameters: any[];

	constructor () {
		super();
		this.scene = new THREE.Scene();
		this.fog = new THREE.FogExp2( 0x000000, 0.0008 );
		this.geometry = new THREE.BufferGeometry();
		this.materials = [];
		this.vertices = [];
		this.sprite = textureLoader.load(textureSprite);

		for ( let i = 0; i < 10000; i ++ ) {
			const x = Math.random() * 2000 - 1000;
			const y = Math.random() * 2000 - 1000;
			const z = Math.random() * 2000 - 1000;
			this.vertices.push(x, y, z);
		}

		this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.vertices, 3 ) );

		this.parameters = [
			[[ 1.0, 1.0, 1.0 ], this.sprite, 2 ],
			[[ 0.95, 0.1, 0.5 ], this.sprite, 1 ],
			[[ 0.90, 0.05, 0.5 ], this.sprite, 0.5 ],
			[[ 0.85, 0, 0.5 ], this.sprite, 0.1 ],
			[[ 0.80, 0, 0.5 ], this.sprite, 0.1 ]
		];

		for (let i = 0; i < this.parameters.length; i++) {
			const color = this.parameters[i][0];
			const sprite = this.parameters[i][1];
			const size = this.parameters[i][2];

			this.materials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
			this.materials[i].color.setHSL(color[0], color[1], color[2]);

			const particles = new THREE.Points(this.geometry, this.materials[i]);

			particles.rotation.x = Math.random() * 6;
			particles.rotation.y = Math.random() * 6;
			particles.rotation.z = Math.random() * 6;

			this.add(particles);
		}
	}

	update () {
		const time = Date.now() * 0.00005;

		for ( let i = 0; i < this.children.length; i ++ ) {
			const object = this.children[i];

			if ( object instanceof THREE.Points ) {
				object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
			}
		}

		for ( let i = 0; i < this.materials.length; i ++ ) {
			const color = this.parameters[i][0];
			const h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
			this.materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );
		}
	}
}

export default Particles;
