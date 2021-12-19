import React, { useContext } from 'react';
import { Mask } from '../../components';
import { UrlContext } from '../../Router';
import GroundControl from '../../GroundControl';
import content from '../../../content.json';

type FooterProps = {
	groundControl?: GroundControl;
};

const Footer: React.FC<FooterProps> = ({
	groundControl
}) => {
	const url = useContext<string>(UrlContext);
	const inIntro = url === '';

	const onClick = (route: 'about' | 'contact') => groundControl?.changePage(route);

	return (
		<div className={`footer ${inIntro ? 'inIntro' : ''}`}>
			<Mask onClick={() => onClick('about')}>
				<p>{content.footer[0]}</p>
			</Mask>

			<Mask onClick={() => onClick('contact')}>
				<p>{content.footer[1]}</p>
			</Mask>
		</div>
	);
};

export default Footer;