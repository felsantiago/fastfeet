import './bootstrap';

import express from 'express';
import cors from 'cors';
import path from 'path';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
