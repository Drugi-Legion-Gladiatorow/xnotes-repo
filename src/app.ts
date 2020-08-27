import express, { Application, Request, Response, NextFunction } from "express"

import repo from "./routes/repo"

const volleyball = require("volleyball")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const middlewares = require("./middlewares")

const app: Application = express()

app.use(morgan("dev"))
app.use(helmet())

app.use(volleyball)

app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response, next: NextFunction) => {})

// API REPO ENDPOINT ROUTES
app.use("/api/repo", repo)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`repo service is listening at port ${PORT}!`)
})
