import { RequestHandler } from "express";

export default (handlers: RequestHandler[]): handlers is RequestHandler[] => {
  return (
    Array.isArray(handlers) &&
    handlers.every((handler) => typeof handler === "function")
  );
};
