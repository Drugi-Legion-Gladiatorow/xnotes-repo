import { Router, Request, Response, NextFunction } from "express"
import { Octokit } from "@octokit/core"
import { getgid } from "process"

require("dotenv").config()

const repo = Router()

// MOCKED USER DATA
const userData = {
  githubId: "31203524", //7773964(mp)
  accessToken: process.env.USER_ACCESS_TOKEN,
  username: process.env.USER_NAME,
  displayName: "null",
  repoName: 'notes'
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

  const octokit = new Octokit({ auth: accessToken })

  try {
    const repo = await octokit.request(`GET /repos/${fullRepoName}`)
    const { html_url } = repo.data

    res.json({
      url: html_url,
    })
  } catch (error) {
    return next(error)
  }
})

repo.post("/create-repo/:name", async (req: Request, res: Response, next: NextFunction) => {
  const { name: repoName } = req.params
  const { accessToken } = userData

  const octokit = new Octokit({ auth: accessToken })

  try {
    const resp = await octokit.request("POST /user/repos", {
      name: repoName,
    })

    res.json({
      info: "info",
    })
  } catch (error) {
    return next(error)
  }
})

repo.post("/save", async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, username, repoName } = userData;
  const message = 'commit';

  const octokit = new Octokit({ auth: accessToken })

  try {
    const resp = await octokit.request(`POST /repos/${username}/${repoName}/git/commits`, {
      accept: 'application/vnd.github.v3+json',
      message,
//      tree: TODO
//      parents: TODO
    })

    res.json({
      message: "success",
    })

  } catch (error) {
    return next(error)
  }

})

module.exports = repo
