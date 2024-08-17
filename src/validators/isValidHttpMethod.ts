import { HttpMethod } from "../types";

export default (method: string): method is HttpMethod => {
  return ["get", "post", "put", "delete", "patch"].includes(method);
};
