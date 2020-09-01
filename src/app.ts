import express from "express"
import { notFound, errorHandler } from "./middlewares"

import path from "path"
const volleyball = require("volleyball")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")

const repo = require("./routes/repo")
const session = require("express-session")

const app = express()

app.use(session({ secret: "keyboardCat" }))
app.use(express.static(path.join(__dirname, "public")))

app.use(morgan("dev"))
app.use(volleyball)
app.use(helmet())

app.use(express.json())
app.use(cors())

// http://localhost:PORT
app.get("/", (req, res, next) => {
  res.json({
    message: "=> from /",
  })
})

// http://localhost:PORT/login?queryString
app.get("/login", (req, res, next) => {
  const { accessToken, username } = req.query

  const user = {
    accessToken: accessToken?.toString(),
    username: username?.toString(),
  }

  req.session.user = user

  res.redirect("/home")
})

app.get("/home", (req, res, next) => {
  // TODO: check if user is authenticated
  res.sendFile(path.join(__dirname + "/public/home.html"))
})

// /API ENDPOINT ROUTES

// localhost:3000/api/=>
app.use("/api", repo)

// ERROR HANDLERS
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`repo service is listening at port ${PORT}!`)
})
