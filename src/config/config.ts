import dotenv from 'dotenv';

export abstract class Configuration {
  constructor() {
    const nodeNameEnv = this.createPathEnv(this.nodeEnv);
    dotenv.config({
      path: nodeNameEnv,
    });
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

  public createPathEnv(path: string): string {
    const arrEnv: string[] = ['env'];

    if (path.length > 0) {
      const stringToArray = path.split('.');
      arrEnv.unshift(...stringToArray);
    }

    return '.' + arrEnv.join('.');
  }
}
