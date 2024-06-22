import { Response } from 'express';

export const errorResponse = (res: Response, statusCode: number, code: string, message: string) => {
  return res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
};
