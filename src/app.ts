import express, { Application, Request, Response, NextFunction } from "express"

import repo from "./routes/repo"

const cors = require("cors")
const app: Application = express()
const volleyball = require("volleyball")

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(res.statusCode || 500)
  res.json({
    message: err.message,
    stack: err.stack,
  })
}

// const notFound = (err: Error, req: Request, res: Response, next: NextFunction) => {
//   res.status(404)
//   const error = new Error(`Not found - ${req.originalUrl}`)
//   next(error)
// }

app.use(volleyball)

app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response, next: NextFunction) => {})

// API REPO ENDPOINT ROUTES
app.use("/api/repo", repo)

// app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`repo service is listening at port ${PORT}!`)
})
