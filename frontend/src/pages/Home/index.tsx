import React, { useEffect, createRef } from 'react';
import map from 'mags-modules/map';
import content from '../../../content.json';

const Home: React.FC = () => {
	const perspectiveContainer = createRef<HTMLDivElement>();

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('mousemove', (e: MouseEvent) => {
			const x = e.clientX - ( window.innerWidth / 2 );
			const mappedX = map(x, 0, window.innerWidth, 0, 30);
			perspectiveContainer.current!.style.transform = `rotateX(20deg) rotateY(${mappedX}deg)`;
		});	
	}, []);

	return (
		<div className='home'>
			<div className='perspective'>
				<div className='perspective-container' ref={perspectiveContainer}>
					<h2 className='tagline'>{content.tagline}</h2>
				</div>
			</div>
		</div>
	);
};

export default Home;