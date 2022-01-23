export class InvalidTrustChainError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;

    // capturing the stack trace keeps the reference to your error class
    // @ts-expect-error
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidEncryptedStateError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;

    // capturing the stack trace keeps the reference to your error class
    // @ts-expect-error
    Error.captureStackTrace(this, this.constructor);
  }
}
