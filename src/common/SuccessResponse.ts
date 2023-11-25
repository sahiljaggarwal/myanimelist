export class SuccessResponse<T> {
  constructor(
    public data: T,
    public success: boolean,
  ) {}
}
