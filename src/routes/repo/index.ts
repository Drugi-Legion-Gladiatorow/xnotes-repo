import { Router, Request, Response, NextFunction } from "express"
import axios from "axios"

const repo = Router()
const GitHub = require("octocat")

// ALL ENDPOINTS ARE PREPENDED WITH: API/REPO

// http://localhost:5000/api/repo
repo.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("hello from /api/repo")
  const { githubId, accessToken, username, displayName } = req.query

  const userData: Request["user"] = {
    githubId: githubId as string,
    accessToken: accessToken as string,
    username: username as string,
    displayName: displayName as string,
  }

  if (!userData.githubId || !userData.accessToken) {
    return next("no user")
  }

  const client = new GitHub({
    token: userData.accessToken,
  })

  req.user = userData
  res.json({
    message: "hello",
  })
})

repo.get("/findRepo/:repoName", async (req: Request, res: Response, next: NextFunction) => {
  console.log("hello from /api/repo/reponame")
  const { repoName } = req.params
  const name = "antoniwrobel"
  const { data } = await axios.get(`https://api.github.com/users/${name}/repos`)
  res.json(data)
})

export default repo
