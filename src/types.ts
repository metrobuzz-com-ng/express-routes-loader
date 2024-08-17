import type { NextFunction, Request, RequestHandler, Response } from "express";

export type ResponseObjectFn = (props: {
  res: Response;
  statusCode: number;
  message: string;
  payload?: unknown;
  responseStatusCode?: string | number;
  status?: boolean;
}) => void;

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export type RouteHandler = {
  path: string;
  method: HttpMethod;
  handlers: RequestHandler[];
};

export type RouteLoaderOptions = {
  servicePrefix?: string;
  hideLogs?: boolean;
  wildcardHandler?: (req: Request, res: Response, next: NextFunction) => void;
};
