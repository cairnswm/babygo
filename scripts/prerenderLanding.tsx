import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import LandingPage from '../src/pages/landing/LandingPageStatic';

const html = renderToStaticMarkup(<LandingPage />);
const outPath =  './public/landing.html';
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);
