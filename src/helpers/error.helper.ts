export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}

export class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}
