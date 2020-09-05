declare namespace Express {
  interface Request {
    session: {
      user: {
        accessToken?: string
        username?: string
      }
    }
    user: {
      accessToken?: string
      username?: string
    }
  }
}
