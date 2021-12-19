import React from 'react';
import content from '../../../content.json';

const About: React.FC = () => (
	<div className='about'>
		<h2>{content.about.title}</h2>
		<p>{content.about.description}</p>
	</div>
);

export default About;