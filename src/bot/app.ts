
import "module-alias/register";
import express from "express";
import * as bodyParser from "body-parser";

import { logger } from "./utils/logger";
import cors from "cors";
import { createFile } from '../bot/exel/create';
import { readFile } from '../bot/exel/read';
import * as fs from 'fs';

const app = express();

// Applying logging service
app.use(logger.middleware());



// Applying CORS for the Swagger
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);


// Parsing JSON request body
app.use(
  bodyParser.json({
    limit: 81920,
  })
);

app.use('/excel', async (req, res) => {
    const fileName = req.body.action.data.board.name;

    let fileData = await createFile(fileName);
    // await readFile(fileData);
    res.send()
})

export { app };
