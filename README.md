# Route Loader for Express

This module provides a flexible way to load and register routes in an Express application from a specified folder. It supports customizable logging and allows for the inclusion of a custom handler for wildcard routes.

## Overview

The route loader dynamically imports route files from a specified folder, registers them with an Express app, and handles wildcard routes. It provides options to customize logging and define a handler for unmatched routes.

## Function Signature

```typescript
export default async (
  routeFolderName: string,
  app: Express,
  servicePrefix?: string,
  wildcardHandler?: (req: Request, res: Response, next: NextFunction) => void,
) => { ... };
```

### Parameters

- **`routeFolderName`**: The path to the folder containing route files. Each file should export an array of `RouteHandler` objects.
- **`app`**: The Express application instance where routes will be registered.
- **`servicePrefix`** (optional): A prefix to prepend to all route paths.
- **`wildcardHandler`** (optional): A custom handler function for wildcard routes (i.e., routes that do not match any registered routes).

## How It Works

1.  **Validation**: Checks if the provided route folder path is valid. If not, an error is thrown.
2.  **Route File Import**: Reads all files in the route folder, strips the index file and file extensions, and imports each file.
3.  **Route Registration**: For each route file, validates that it exports an array of `RouteHandler` objects. Each route is registered with the Express app. Duplicate routes are logged as warnings.
4.  **Wildcard Route Handling**: A default wildcard route handler is registered to handle any requests that do not match registered routes. If a `wildcardHandler` is provided, it will be used instead of the default handler.
5.  **Logging**: Logs the loading process and route registrations. The logging behavior can be customized.

## Example Usage

```typescript
import express from "express";
import routeLoader from "@metrobuzz/express-routes-loader";

const app = express();
const routeFolder = "./routes";

// Custom handler for wildcard routes
const customWildcardHandler = (req, res) => {
  res.status(404).json({ message: "Custom Not Found" });
};

// Load routes with a custom prefix and wildcard handler
routeLoader(routeFolder, app, "/api", customWildcardHandler)
  .then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.error(err));
```

Alternative,

```typescript
import express from "express";
import routeLoader from "@metrobuzz/express-routes-loader";

const app = express();
const routeFolder = "./routes";

// Custom handler for wildcard routes
const customWildcardHandler = (req, res) => {
  res.status(404).json({ message: "Custom Not Found" });
};

const load = async () => {
  try {
    await routeLoader(routeFolder, app, "/api", customWildcardHandler);
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.error("Error loading routes:", error);
  }
};

load();
```

## Route File Format

Each file in the `routeFolderName` should export an array of `RouteHandler` objects. Here's a sample structure:

### Folder Structure

```plain
routes/
  ├── users.ts
  ├── products.ts
  └── orders.ts
```

### Sample Route Files

#### `routes/users.ts`

```typescript
import { Request, Response } from "express";
import { RouteHandler } from "@metrobuzz/express-routes-loader";

// Define route handlers
const getUsers: RouteHandler = {
  path: "/users",
  method: "get",
  handlers: [
    (req: Request, res: Response) => {
      res.json({ message: "List of users" });
    },
  ],
};

const createUser: RouteHandler = {
  path: "/users",
  method: "post",
  handlers: [
    (req: Request, res: Response) => {
      res.json({ message: "User created" });
    },
  ],
};

// Export route handlers as an array
export default [getUsers, createUser];
```

#### `routes/products.ts`

```typescript
import { Request, Response } from "express";
import { RouteHandler } from "@types";

// Define route handlers
const getProducts: RouteHandler = {
  path: "/products",
  method: "get",
  handlers: [
    (req: Request, res: Response) => {
      res.json({ message: "List of products" });
    },
  ],
};

const createProduct: RouteHandler = {
  path: "/products",
  method: "post",
  handlers: [
    (req: Request, res: Response) => {
      res.json({ message: "Product created" });
    },
  ],
};

// Export route handlers as an array
export default [getProducts, createProduct];
```

#### `routes/orders.ts`

```typescript
import { Request, Response } from "express";
import { RouteHandler } from "@types";

// Define route handlers
const getOrders: RouteHandler = {
  path: "/orders",
  method: "get",
  handlers: [
    (req: Request, res: Response) => {
      res.json({ message: "List of orders" });
    },
  ],
};

const createOrder: RouteHandler = {
  path: "/orders",
  method: "post",
  handlers: [
    (req: Request, res: Response) => {
      res.json({ message: "Order created" });
    },
  ],
};

// Export route handlers as an array
export default [getOrders, createOrder];
```

## Alternative Route Handler Format

Route handlers can also be defined in an alternative format. Here's an example:

```typescript
import { Request, Response } from "express";
import { RouteHandler } from "@types";

// Define route handlers
const serviceLoader: RouteHandler[] = [
  {
    path: "/example",
    method: "get", // get, put, post, patch, delete
    handlers: [
      (req: Request, res: Response) => {
        res.json({ message: "Example route" });
      },
    ],
  },
];

export default serviceLoader;
```

### Explanation

1.  **File Structure**: Each file in the `routes` folder represents a module containing route handlers. These files are imported and their default export is expected to be an array of `RouteHandler` objects.

2.  **RouteHandler Interface**: Each `RouteHandler` object includes:

    - `path`: The route path.
    - `method`: The HTTP method (e.g., 'get', 'post').
    - `handlers`: An array of handler functions that handle requests to this route.

3.  **Export**: Each file exports an array of `RouteHandler` objects. This array is dynamically loaded and registered by the route loader function.

This setup allows you to modularize your routes and manage them easily. Each route file is responsible for its own set of routes, making the route configuration clean and maintainable.
