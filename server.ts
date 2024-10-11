import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import AppServerModule from './src/main.server';
import { REQUEST as SSR_REQUEST } from "ngx-cookie-service-ssr";
import { resolve } from 'path';  // Aggiungi questo import

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = join(process.cwd(), 'dist/sostina/server');
  const browserDistFolder = resolve(serverDistFolder, '../../static');  // Modifica qui per puntare a "static"
  
  const indexHtml = existsSync(join(browserDistFolder, 'index.original.html'))
    ? join(browserDistFolder, 'index.original.html')
    : join(browserDistFolder, 'index.html');
  
  const commonEngine = new CommonEngine();
  
  // Imposta le viste e il motore di rendering
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);
  
  // Serve file statici dalla cartella 'static'
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));
  
  // Tutte le altre rotte usano l'engine Angular
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
  
    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: req.baseUrl },
          { provide: SSR_REQUEST, useValue: req },
          { provide: 'RESPONSE', useValue: res },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 3000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default AppServerModule;
