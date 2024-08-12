import { Response } from '@nestjs/common';

export function generalResponse(
  response: Response,
  data: object | string = {},
  message: string = '',
  responseType: boolean = false,
  toast: boolean = false,
  statusCode: number = 200,
) {
  response.status(statusCode).json({
    data: data,
    message: message,
    toast: toast,
    response_type: responseType,
  });
}
