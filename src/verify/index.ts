import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface IDecoded {
  userId: string;
  iat: number;
  exp: number;
}

const router = express.Router();

// Verify route to check the validity of the JWT token
router.get('/', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Missing token' });
  }
  try {
    const decoded = jwt.verify(token, 'your_secret_key') as IDecoded;
    if (decoded.userId) {
      // Token is valid
      return res
        .status(200)
        .json({ status: 'success', message: 'Token is valid' });
    } else {
      // Token is invalid
      return res
        .status(401)
        .json({ status: 'error', message: 'Invalid token' });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  }
});

export const verifyRouter = router;
