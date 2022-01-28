export {};

declare global {
  namespace Express {
    interface Request {
      session?: {
        uid: number
      },
      sessionID: string,
      fields: any
    }
  }
}