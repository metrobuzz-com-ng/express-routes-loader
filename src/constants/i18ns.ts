export default {
  LOGS: {
    GENERAL: {
      WILDCARD: "Resource not found",
      INVALID_DESTINATION_PATH:
        "Routes folder does not exist. Kindly update route folder path",
      AVAILABLE_ROUTES_BELOW: "Available Routes below",
      FN: {
        FILE_DOES_NOT_EXIST: (fileName: string) =>
          `File - ${fileName} does not exist`,
        MUST_BE_ROUTE_HANDLER_ARRAY: (fileName: string) =>
          `File - ${fileName} must export an array of RouteHandler objects`,
        DUPLICATE_ROUTE_DETECTED: (finalPath: string) =>
          `Warning: Duplicate route detected - ${finalPath}`,
        LOADED_ROUTES: (elapsedTime: number) =>
          `Loaded routes in - ${elapsedTime.toFixed(3)}ms`,
      },
    },
  },
};
