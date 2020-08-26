import express, { Application } from "express"
import bodyParser from "body-parser"

// import router from "./routes"
// import connect from "./db/connection"

const cors = require("cors")

function onInit() {
  const app: Application = express()

  app.use(bodyParser.json())
  app.use(cors())

  app.get("/", (req, res) => {
    return res.send({
      message: "hello",
    })
  })
  // connect()
  // app.use(router)

  app.listen(process.env.PORT || 3000, () => {
    console.log(`auth service is listening at port ${process.env.PORT || 3000}!`)
  })
}

onInit()
