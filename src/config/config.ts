import dotenv from 'dotenv';

export abstract class Configuration {
  constructor() {
    dotenv.config();
  }

  public getEnviroment(k: string): string | undefined {
    return process.env[k];
  }

  public getNumberEnviroment(k: string): number {
    return Number(this.getEnviroment(k));
  }

  public get nodeEnv(): string {
    return this.getEnviroment('NODE_ENV')?.trim() || '';
  }
}
