import { Router, Request, Response, NextFunction } from "express"

import { exec } from "child_process"

import * as fs from 'fs';

require("dotenv").config()

const repo = Router()

const cdToDockerVolume = "cd ../repo_volume"

repo.get("/", (req: Request, res: Response, next: NextFunction): void => {
    exec(`${cdToDockerVolume}; ls;`, (err, stdout, stderr) => {

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

repo.post("/createDir/:name", async (req: Request, res: Response, next: NextFunction) => {
    const { name: directoryName } = req.params
    exec(`${cdToDockerVolume}; mkdir ${directoryName};`, (err, stdout, stderr) => {

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
    const repoDirectory = '../repo_volume/';
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
    const repoDirectory = '../repo_volume/';
    const { name: name } = req.params
    if(!req.body.blob) {
        res.status(400)
        res.json({
            meeage: 'field:blob missing',
          })
    }
    var buf = Buffer.from(req.body.blob, 'binary');
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