import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Configuration } from './config/config';
import { Connection } from './config/database/connection.database';
import ModelsInitializer from './data/models/models-initializer';
import cookieParser from 'cookie-parser';
import { Passport } from './config/passport/passport';
import indexRouter from './routers/index.router';
import { ErrorMiddleware } from './middlewares/error.middleware';
import session from 'express-session';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import swaggerUi, { JsonObject } from 'swagger-ui-express';

class Main extends Configuration {
  public app: express.Application;
  private HTTP_PORT: number = this.getNumberEnviroment('HTTP_PORT');
  private API_URL: string = this.getEnviroment('API_URL')!;
  private SECRET_KEY: string = this.getEnviroment('SECRET_KEY')!;
  private swaggerDoc;
  constructor() {
    super();
    this.swaggerDoc = yaml.load(
      fs.readFileSync('./src/config/docs/swagger-documentation.yml', 'utf8')
    ) as JsonObject;
    this.app = express();

    this.app.use(express.json());
    this.app.use(cookieParser(this.SECRET_KEY));
    this.app.use(morgan('dev'));
    this.app.use(ErrorMiddleware.handleError);
    this.app.use(
      session({
        secret: this.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      })
    );
    this.app.use(
      '/documentation',
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerDoc)
    );

    this.corsConfig();
    this.app.use(indexRouter);
    this.initializeDatabase();

    new ModelsInitializer();
    new Passport();

    this.listen();
  }

  public async initializeDatabase() {
    const dbConnection = Connection.getInstance();
    await dbConnection.createConnection();
  }

  public listen() {
    this.app.listen(this.HTTP_PORT, () => {
      console.log(`Server running on ${this.API_URL}:${this.HTTP_PORT}`);
    });
  }

  private corsConfig() {
    const whitelist = this.getEnviroment('CORS')?.split(' ')!;
    const corsOptions = {
      origin(origin: any, callback: any) {
        if (!origin || whitelist.includes(origin)) {
          callback(null, true);
        } else {
          console.error('Not allowed by cors', { origin });
          callback(new Error('Not allowed by cors'));
        }
      },
      credentials: true,
    };

    this.app.use(cors(corsOptions));
  }
}

new Main();
