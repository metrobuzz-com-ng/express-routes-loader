import { RouteHandler } from "@types";
import isRouteHandler from "./isRouteHandler";

export default (arr: RouteHandler[]): arr is RouteHandler[] => {
  return Array.isArray(arr) && arr.every((item) => isRouteHandler(item));
};
