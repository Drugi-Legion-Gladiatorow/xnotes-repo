import { Request, Response, NextFunction } from "express"

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404)

  const error = new Error(`Not Found - ${req.url}`)
  next(error)
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  // source err =>
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  })
}
