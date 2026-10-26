# Backend architecture

The backend is organized by product feature. Each feature owns its HTTP routes,
controllers, and Mongoose models. Shared infrastructure stays outside the
feature modules.

```text
server.js                 # process entry point and startup
src/
  app.js                  # Express configuration and route mounting
  config/db.js             # database connection
  shared/
    middleware/            # authentication and authorization middleware
    utils/                 # shared utilities such as email delivery
  modules/
    user/{user.routes,user.controller,user.service,user.repository,user.model,user.validator}
    menu/{menu.routes,menu.controller,menu.service,menu.model}
    meal-token/{meal-token.routes,meal-token.controller,meal-token.service,meal-token.model}
    employee/{employee.routes,employee.controller,employee.service,employee.model}
    dashboard/{dashboard.routes,dashboard.controller,dashboard.service}
```

Keep feature-specific behavior in its module and reusable infrastructure in
`src/shared`. Controllers handle HTTP input/output; services contain feature
logic and database operations. The user module also separates persistence into
a repository and input checks into a validator. Dashboard reads data from the
menu, meal-token, and user modules, so those cross-feature dependencies stay
explicit.

The route prefixes and endpoint paths remain mounted by `src/app.js`:
`/api/auth/users`, `/api/menu`, `/api/tokens`, `/api/employees`, and
`/api/dashboard`.
