import { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import { logger } from "netwrap";
import path from "path";
import { performance } from "perf_hooks";
import { normalCaseGenerator } from "normal-case-generator";
import { isRouteHandlerArray, isValidDestinationPath } from "./validators";
import {
  joinUrls,
  responseObject,
  stripFileExtension,
  stripIndex,
} from "./utils";
import { RouteHandler, RouteLoaderOptions } from "./types";
import { HttpStatusCode, i18ns } from "./constants";

const routeLoader = async (
  routeFolderName: string,
  app: Express,
  options: RouteLoaderOptions = {},
) => {
  const startTime = performance.now();
  const { servicePrefix, hideLogs = false, wildcardHandler } = options;

  if (!isValidDestinationPath(routeFolderName)) {
    throw new Error(i18ns.LOGS.GENERAL.INVALID_DESTINATION_PATH);
  }

  const files = await fs.promises.readdir(routeFolderName);
  const registeredRoutes = new Set<string>();

  if (!hideLogs) {
    logger(i18ns.LOGS.GENERAL.AVAILABLE_ROUTES_BELOW);
  }

  for (const file of stripIndex(files)) {
    const filePath = path.resolve(routeFolderName, file);
    const fileName = stripFileExtension(file);

    if (!fs.existsSync(filePath)) {
      throw new Error(i18ns.LOGS.GENERAL.FN.FILE_DOES_NOT_EXIST(fileName));
    }

    const importedFile = (await import(filePath)) as {
      default: RouteHandler[];
    };

    if (!isRouteHandlerArray(importedFile.default)) {
      throw new Error(
        i18ns.LOGS.GENERAL.FN.MUST_BE_ROUTE_HANDLER_ARRAY(fileName),
      );
    }

    importedFile.default.map((service) => {
      const finalPath = joinUrls([stripFileExtension(file), service.path]);

      if (registeredRoutes.has(finalPath)) {
        if (!hideLogs) {
          logger(i18ns.LOGS.GENERAL.FN.DUPLICATE_ROUTE_DETECTED(finalPath));
        }
        return;
      }

      let mainPath = finalPath;

      if (servicePrefix) {
        mainPath = `${servicePrefix}${finalPath}`;
      }

      if (!hideLogs) {
        logger(`${mainPath} - ${normalCaseGenerator(service.method)}`);
      }
      app[service.method](mainPath, ...service.handlers);
      registeredRoutes.add(mainPath);
    });
  }

  app.use("*", (req: Request, res: Response, next: NextFunction) => {
    if (wildcardHandler) {
      wildcardHandler(req, res, next);
    } else {
      responseObject({
        res,
        message: i18ns.LOGS.GENERAL.WILDCARD,
        statusCode: HttpStatusCode.NotFound,
      });
    }
  });

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  if (!hideLogs) {
    logger(i18ns.LOGS.GENERAL.FN.LOADED_ROUTES(elapsedTime));
  }
};

export default routeLoader;

export * from "./validators";
export * from "./utils";
export * from "./constants";
