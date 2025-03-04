export class HandledError {
  constructor(
    public statusCode: number,
    public message: string = '',
    public isWarn?: boolean,
  ) {}
}
