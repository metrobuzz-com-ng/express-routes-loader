import { RouteHandler } from "../types";
import isRequestHandlerArray from "./isRequestHandlerArray";
import isValidHttpMethod from "./isValidHttpMethod";

export default (obj: RouteHandler): obj is RouteHandler => {
  return (
    typeof obj === "object" &&
    typeof obj.path === "string" &&
    isValidHttpMethod(obj.method) &&
    isRequestHandlerArray(obj.handlers)
  );
};
