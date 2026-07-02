import { Response } from "express";

interface SuccessResponseParams {
  res: Response;
  message: string;
  data?: any;
  meta?: any;
  statusCode?: number;
}

export const sendSuccess = ({
  res,
  message,
  data = {},
  meta = {},
  statusCode = 200,
}: SuccessResponseParams): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};
