import httpStatusCode from 'http-status-codes';

export interface APIError {
  message: string;
  code: number;
  codeAsString?: string;
  description?: string;
  documentation?: string;
}

export interface APIErrorResponde extends Omit<APIError, 'codeAsString'> {
  error: string;
}

export default class ApiError {
  public static format(error: APIError): APIErrorResponde {
    return {
      ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString
          ? error.codeAsString
          : httpStatusCode.getStatusText(error.code),
      },
      ...(error.documentation && { documentation: error.documentation }),
      ...(error.description && { description: error.description }),
    };
  }
}
