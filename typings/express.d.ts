declare namespace Express {
  interface Request {
    log: import("bunyan");
    reqId: string;
    pubsub: import("graphql-redis-subscriptions").RedisPubSub;
    db: import("db-v2").DbType;
    cache: import("cache-v2").CacheClientCreateType;
    notification?: import("services-v2/core/gql/notification/notification").notificationType;
    mail: import("modules-v2/mail").MailFunctionsType;
    user?: {
      id: string;
      publicId: string;
      email?: string;
      username?: string;
      password?: string;
      name?: string;
    };
    token?: string;
    search?: import("utils/prettyHooks").Search | null;
    paggination?: import("utils/prettyHooks").Paggination;
    company?: import("db-v2/models/Companies").Company;
    employee?: import("db-v2/models/Employees").Employee;
    project?: import("db-v2/models/Projects").Project;
  }

  interface Response {
    "Version-Backend-Build": string;
    log: import("bunyan");
    db: import("db-v2").DbType;
    cache: import("cache-v2").CacheClientCreateType;
  }
}
