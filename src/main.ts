import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Configuration } from './config/config';
import { Connection } from './config/database/connection.database';
import ModelsInitializer from './data/models/models-initializer';
import userRouter from './routers/user.router';
import cookieParser from 'cookie-parser';
import { Passport } from './config/passport/passport';

class Main extends Configuration {
  public app: express.Application;
  private HTTP_PORT: number = this.getNumberEnviroment('HTTP_PORT');
  private API_URL: string = this.getEnviroment('API_URL')!;
  private SECRET_KEY: string = this.getEnviroment('SECRET_KEY')!;

  constructor() {
    super();
    this.app = express();
    this.app.use(express.json());
    this.app.use(cookieParser(this.SECRET_KEY));
    this.app.use(morgan('dev'));
    this.app.use(userRouter);
    this.corsConfig();
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
    };

    this.app.use(cors(corsOptions));
  }
}

new Main();
