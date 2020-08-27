import { Router, Request, Response, NextFunction } from "express"

require("dotenv").config()

const repo = Router()
const GitHub = require("octocat")

// MOCKED USER DATA
const userData = {
  githubId: "31203524",
  accessToken: process.env.USER_ACCESS_TOKEN,
  username: process.env.USER_NAME,
  displayName: "null",
}

// http://localhost:PORT/api
repo.get("/", (req: Request, res: Response, next: NextFunction): void => {
  // const { githubId, accessToken, username, displayName } = req.query
  // const userData: Request["user"] = {
  //   githubId: githubId as string,
  //   accessToken: accessToken as string,
  //   username: username as string,
  //   displayName: displayName as string,
  // }

  const { githubId, accessToken } = userData

  if (!githubId || !accessToken) {
    const error = new Error("user not found")
    res.status(404)
    return next(error)
  }

  res.json({
    message: "=> from /api",
  })
})

// http://localhost:PORT/api/find-repo/:name
repo.get("/find-repo/:name", async (req: Request, res: Response, next: NextFunction) => {
  const { name: repoName } = req.params
  const { username, accessToken } = userData

  const fullRepoName = `${username}/${repoName}`

  const client = new GitHub({
    token: accessToken,
  })

  try {
    const repo = await client.repo(fullRepoName)
    const { html_url } = await repo.info()

    res.json({
      url: html_url,
    })
  } catch (error) {
    return next(error)
  }
})

module.exports = repo
