import { Sequelize } from 'sequelize';
import { Configuration } from '../config';

export class Connection extends Configuration {
  public sequelize: Sequelize;

  private static instance: Connection;

  constructor() {
    super();
    this.sequelize = new Sequelize(
      this.getEnviroment('MYSQL_DB')!,
      this.getEnviroment('MYSQL_USER')!,
      this.getEnviroment('MYSQL_PASS')!,
      {
        host: this.getEnviroment('MYSQL_HOST'),
        dialect: 'mysql',
        port: this.getNumberEnviroment('MYSQL_PORT'),
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    );
  }

  public static getInstance(): Connection {
    if (!Connection.instance) {
      Connection.instance = new Connection();
    }

    return Connection.instance;
  }

  public async createConnection() {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');

      await this.sequelize.sync({ force: false });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}
