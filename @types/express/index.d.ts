declare namespace Express {
  interface Request {
    session: {
      user: {
        accessToken?: string
        username?: string
      }
    }
  }
}
