declare module '*.svg' {
	const content: any;
	export default content;
}

declare module '*.glb' {
	const content: any;
	export default content;
}

declare module '*.png' {
	const content: any;
	export default content;
}

declare module '*.jpg' {
	const content: any;
	export default content;
}

declare module '*.md' {
	const content: any;
	export default content;
}

declare module 'mags-modules/map' {
	export default (x: number, a: number, b: number, c: number, d: number): number => number;
}