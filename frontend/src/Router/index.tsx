import React, { useEffect, useState, useContext } from 'react';

const urlChanged = new Event('urlChanged');
export const UrlContext = React.createContext<string>('');

export const changeUrl = (url: string) => {
	if (typeof window === 'undefined') return;
	window.history.pushState(null, '', `/${url}`);
	window.dispatchEvent(urlChanged);
};

export const getUrl = (): string => (
	(typeof window !== 'undefined') ? window.location.pathname.substring(1) : ''
);

type RouterProps = {
  children: React.ReactNode;
};

export const Router: React.FC<RouterProps> = ({
	children
}) => {
	const [url, setUrl] = useState<string>('');

	useEffect(() => {
		setUrl(getUrl());
		window.addEventListener('urlChanged', () => {
			setUrl(getUrl());
		});
	}, []);

	return (
		<div>
			<UrlContext.Provider value={url}>
				{children}
			</UrlContext.Provider>
		</div>
	);
};

type PageProps = {
	children: React.ReactNode;
	path?: string | string[]
};

export const Page: React.FC<PageProps> = ({
	children,
	path
}) => {
	const url = useContext<string>(UrlContext);

	const active = () => {
		if (typeof path === 'undefined') return true;
		if (typeof path === 'string') return url === path;
		if (typeof path === 'object') return path.includes(url);
	};

	return (
		<div className={`page ${active() ? 'active' : ''}`}>
			<div className={'page-container'}>
				{children}
			</div>
		</div>
	);
};