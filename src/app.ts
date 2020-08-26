import express, { Application, Request, Response, NextFunction } from "express"
import bodyParser from "body-parser"
import repo from "./routes/repo"

const cors = require("cors")
const app: Application = express()
const volleyball = require("volleyball")

app.use(volleyball)

console.log("INIT")

const notFound = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)

  next(error)
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(res.statusCode || 500)
  res.json({
    message: err.message,
    stack: err.stack,
  })
}

app.use(bodyParser.json())
app.use(cors())

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "hello from /",
  })
})

// API REPO ENDPOINT ROUTES
app.use("/api/repo", repo)

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT || 3000, () => {
  console.log(`repo service is listening at port ${process.env.PORT || 3000}!`)
})
