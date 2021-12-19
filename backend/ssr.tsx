import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs/promises';

export default async (filepath: string, component: React.ReactElement): Promise<string | unknown> => {
	const app = ReactDOMServer.renderToString(component);
	const file = filepath;
	const data = await fs.readFile(file, 'utf8');
	return data.replace('<div id="root"></div>', `<div id="root">${app}</div>`);
};