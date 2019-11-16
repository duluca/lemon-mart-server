import { NextFunction, Request, Response } from 'express-serve-static-core'
import * as jwt from 'jsonwebtoken'
import { ObjectID } from 'mongodb'

import { JwtSecret } from '../config'
import { IUser, UserCollection } from '../models/user'

export const IncorrectEmailPasswordMessage = 'Incorrect email and/or password'
export const AuthenticationRequiredMessage = 'Request has not been authenticated'

interface IJwtPayload {
  email: string
  role: string
  picture: string
  iat: number
  exp: number
  sub: string
}

export function createJwt(user: IUser): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const payload = {
      email: user.email,
      role: user.role,
      picture: user.picture
    }

    jwt.sign(
      payload,
      JwtSecret,
      {
        subject: user._id.toHexString(),
        expiresIn: '1d',
      },
      (err: Error, encoded: string) => {
        if (err) {
          reject(err.message)
        }
        resolve(encoded)
      }
    )
  })
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = jwt.verify(
      sanitizeToken(req.headers.authorization),
      JwtSecret
    ) as IJwtPayload
    const currentUser = await UserCollection.findOne({ _id: new ObjectID(payload?.sub) })
    if (!currentUser) {
      throw new Error("User doesn't exist")
    }
    res.locals.currentUser = currentUser
    return next()
  } catch (ex) {
    return res.status(401).send({ message: ex.message })
  }
}

function sanitizeToken(authorization: string | undefined) {
  const authString = authorization || ''
  const authParts = authString.split(' ')
  return authParts.length === 2 ? authParts[1] : authParts[0]
}
