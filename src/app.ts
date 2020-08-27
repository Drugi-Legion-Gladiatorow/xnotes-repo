import express, { Application, Request, Response, NextFunction } from "express"
import { notFound, errorHandler } from "./middlewares"

const volleyball = require("volleyball")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")

const repo = require("./routes/repo")

const app: Application = express()

app.use(morgan("dev"))
app.use(helmet())

app.use(volleyball)

app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "=> from /api/repo",
  })
})

// API REPO ENDPOINT ROUTES
app.use("/api/repo", repo)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`repo service is listening at port ${PORT}!`)
})
