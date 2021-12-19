import React from 'react';

type MaskProps = {
	children: React.ReactNode;
	on?: boolean;
	onClick?: () => void;
};

const Mask: React.FC<MaskProps> = ({
	children,
	on = false,
	onClick
}) => {
	const active = on;

	return (
		<div className='mask'>
			<a className={`mask-container ${active ? 'active' : ''}`} onClick={onClick? () => onClick() : undefined}>
				<div className='mask-text'>
					{children}
				</div>
				<div className='mask-cover'></div>
			</a>
		</div>
	);
};

export default Mask;