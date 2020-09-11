import { Router, Request, Response, NextFunction } from "express"
import { Octokit } from "@octokit/core"
import { exec } from "child_process"

require("dotenv").config()

const repo = Router()

// MOCKED USER DATA
const userData = {
  githubId: process.env.USER_ID,
  accessToken: process.env.USER_ACCESS_TOKEN,
  username: process.env.USER_NAME,
  displayName: "null",
  repoName: "notes",
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
    const {
      data: { html_url },
    } = await octokit.request(`GET /repos/${fullRepoName}`)

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
    await octokit.request("POST /user/repos", {
      name: repoName,
    })

    res.json({
      info: "repo has been created",
    })
  } catch (error) {
    return next(error)
  }
})

repo.post("/save", async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, username, repoName } = userData

  const message = "commit"
  const branch = "origin/master"

  // relative path issue
  const cdToDockerVolume = "cd ../repository"

  const gitAdd = "git add ."
  const gitCommit = `git commit -m "${message}"`
  const gitPush = `git push`

  exec(` ${cdToDockerVolume}; ${gitAdd}; ${gitCommit}; ${gitPush}`, (err, stdout, stderr) => {
    // TODO: done handler flag
    if (err) {
      console.error("push error", repoName)
      console.error(err)
      next(err)
    } else {
      console.log("push done", repoName)
      console.log(stdout)
      res.json({
        message: stdout || "changes has been saved",
        // done | save
      })
    }
  })
})

repo.get("/update", async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, username, repoName } = userData

  // relative path issue
  const cdToDockerVolume = "cd ../repository"
  const doesRepoExist = "[ -d .git ];"
  const gitFetch = "git fetch --all; git reset --hard origin/master; "
  const gitClone = `git clone https://${accessToken}@github.com/${username}/${repoName}.git .;`
  const setInitialConfig = `git config user.name "${username}"; git config user.email "<>";`

  exec(
    ` ${cdToDockerVolume}; if ${doesRepoExist} then ${gitFetch} else ${gitClone} ${setInitialConfig} fi;  `,
    (err, stdout, stderr) => {
      // TODO: done handler flag
      if (err) {
        console.error("cloning error", repoName)
        console.error(err)
        next(err)
      } else {
        console.log("cloning done", repoName)
        console.log(stdout)
        res.json({
          message: stdout || "repo has been cloned",
          // done | save
        })
      }
    }
  )
})

module.exports = repo

// POBRANIE STR DANYCH Z REPO
// ZAŁADOWANIE POJEDYŃCZEGO PLIKU Z REPO md.FILE to txtarea

// fileSystem -> node
// txtarea -> update -> md.FILE
// create folder/md.FILE from UI

// cra as a service
