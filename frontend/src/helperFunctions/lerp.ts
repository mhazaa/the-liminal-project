const lerp = (start: number, end: number, amt: number) => {
	const value = (1 - amt) * start + amt * end;
	return value;
};

export default lerp;