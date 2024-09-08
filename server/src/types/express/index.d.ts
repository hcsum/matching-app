declare namespace Express {
  export interface Request {
    ctx: {
      user?: {
        id: string;
      };
    };
  }
}

