declare namespace Express {
  interface Request {
    user: {
      githubId: string
      accessToken: string
      username: string
      displayName?: string
    }
  }
}
