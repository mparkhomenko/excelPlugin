import { createClient, ClientOpts } from "redis";


export const cacheInit = (creds:ClientOpts) =>
  createClient(
    creds
  );
