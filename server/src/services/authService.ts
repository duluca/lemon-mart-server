import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { ObjectID } from 'mongodb'

import { JwtSecret } from '../config'
import { Role } from '../models/enums'
import { IUser, User, UserCollection } from '../models/user'

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
      picture: user.picture,
    }

    jwt.sign(
      payload,
      JwtSecret(),
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

export function authenticate(options?: {
  requiredRole?: Role
  permitIfSelf?: {
    idGetter: (req: Request) => string
    requiredRoleCanOverride: boolean
  }
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.currentUser = await authenticateHelper(req.headers.authorization, {
        requiredRole: options?.requiredRole,
        permitIfSelf: options?.permitIfSelf
          ? {
              id: options?.permitIfSelf.idGetter(req),
              requiredRoleCanOverride: options?.permitIfSelf.requiredRoleCanOverride,
            }
          : undefined,
      })
      return next()
    } catch (ex) {
      return res.status(401).send({ message: ex.message })
    }
  }
}

export async function authenticateHelper(
  authorizationHeader?: string,
  options?: {
    requiredRole?: Role
    permitIfSelf?: {
      id: string
      requiredRoleCanOverride: boolean
    }
  }
): Promise<User> {
  if (!authorizationHeader) {
    throw new Error('Request is missing authorization header')
  }

  const payload = jwt.verify(
    sanitizeToken(authorizationHeader),
    JwtSecret()
  ) as IJwtPayload
  const currentUser = await UserCollection.findOne({
    _id: new ObjectID(payload?.sub),
  })
  if (!currentUser) {
    throw new Error("User doesn't exist")
  }

  if (
    options?.permitIfSelf &&
    !currentUser._id.equals(options.permitIfSelf.id) &&
    !options.permitIfSelf.requiredRoleCanOverride
  ) {
    throw new Error(`You can only edit your own records`)
  }

  if (options?.requiredRole && currentUser.role !== options.requiredRole) {
    throw new Error(`You must have role: ${options.requiredRole}`)
  }

  return currentUser
}

function sanitizeToken(authorization: string | undefined) {
  const authString = authorization || ''
  const authParts = authString.split(' ')
  return authParts.length === 2 ? authParts[1] : authParts[0]
}
