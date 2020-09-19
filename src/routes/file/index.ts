import { Router, Request, Response, NextFunction } from "express"

import { exec } from "child_process"

import * as fs from 'fs';

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

const cdToDockerVolume = "cd repo_volume"

// http://localhost:PORT/api
repo.get("/", (req: Request, res: Response, next: NextFunction): void => {
    exec(`${cdToDockerVolume}; ls;`, (err, stdout, stderr) => {
        // TODO: done handler flag
        if (err) {
          console.error(err)
          next(err)
        } else {
          console.log(stdout)
          res.json({
            files: stdout,
          })
        }
      })
})

// http://localhost:PORT/api/find-repo/:name
repo.post("/createDir/:name", async (req: Request, res: Response, next: NextFunction) => {
    const { name: directoryName } = req.params
    exec(`${cdToDockerVolume}; mkdir ${directoryName};`, (err, stdout, stderr) => {
        // TODO: done handler flag
        if (err) {
            res.json({
                meeage: err.message,
              })
          next(err)
        } else {
          res.json({
            result: 'success'
          })
        }
      })
})

repo.post("/createFile/:name", async (req: Request, res: Response, next: NextFunction) => {
    const { name: directoryName } = req.params
    exec(`${cdToDockerVolume}; touch ${directoryName};`, (err, stdout, stderr) => {
        // TODO: done handler flag
        if (err) {
            res.json({
                meeage: err.message,
              })
          next(err)
        } else {
          res.json({
            result: 'success'
          })
        }
      })
})

repo.delete("/deleteFile/:name", async (req: Request, res: Response, next: NextFunction) => {
    const { name: directoryName } = req.params
    exec(`${cdToDockerVolume}; rm ${directoryName};`, (err, stdout, stderr) => {
        // TODO: done handler flag
        if (err) {
            res.json({
                meeage: err.message,
              })
          next(err)
        } else {
          res.json({
            result: 'success'
          })
        }
      })
})

repo.delete("/deleteDir/:name", async (req: Request, res: Response, next: NextFunction) => {
    const { name: directoryName } = req.params
    exec(`${cdToDockerVolume}; rm -rf ${directoryName};`, (err, stdout, stderr) => {
        // TODO: done handler flag
        if (err) {
            res.json({
                meeage: err.message,
              })
          next(err)
        } else {
          res.json({
            result: 'success'
          })
        }
      })
})

repo.patch("/updateFile/:name", async (req: Request, res: Response, next: NextFunction) => {
    const repoDirectory = './repo_volume/';
    const { name: name } = req.params
    if(!req.body.content) {
        res.status(400)
        res.json({
            meeage: 'field:content missing',
          })
    }

    fs.writeFile(`${repoDirectory}${name}`, req.body.content, (err) => {
        if (err) {
            res.json({
                meeage: err,
              })
          next(err)
        } else {
          res.json({
            result: 'success'
          })
        }
    });
})

repo.post("/uploadFile/:name", async (req: Request, res: Response, next: NextFunction) => {
    const repoDirectory = './repo_volume/';
    const { name: name } = req.params
    if(!req.body.blob) {
        res.status(400)
        res.json({
            meeage: 'field:blob missing',
          })
    }
    var buf = Buffer.from(req.body.blob, 'binary'); // decode
    fs.writeFile(`${repoDirectory}${name}`, buf, function(err) {
        if (err) {
            res.json({
                meeage: err,
              })
          next(err)
        } else {
          res.json({
            result: 'success'
          })
        }
    }); 

 
})

module.exports = repo