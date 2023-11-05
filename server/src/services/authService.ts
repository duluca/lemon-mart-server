import { NextFunction, Request, Response } from 'express'
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { JwtSecret } from '../config'
import { GraphQLPath } from '../graphql/api.graphql'
import { Role } from '../models/enums'
import { IUser, User, UserCollection } from '../models/user'

export const IncorrectEmailPasswordMessage = 'Incorrect email and/or password'
export const AuthenticationRequiredMessage = 'Request has not been authenticated'
const UserDoesntExistMessage = "User doesn't exist"
const MissingAuthHeaderMessage = 'Request is missing authorization header'
const CanOnlyEditOwnMessage = `You can only edit your own records`
const MustHaveRoleMessage = `You must have role`

const IntrospectionQuery: string = 'IntrospectionQuery'
const GraphQLBaseOperation: string = 'GraphQL'
const PermittedOperations = [GraphQLBaseOperation, IntrospectionQuery]

interface IJwtPayload {
  email: string
  role: string
  picture: string
  iat: number
  exp: number
  sub: string
}

export interface IAuthOptions {
  requiredRole?: Role
  permitIfSelf?: {
    id?: string
    idGetter?: (context: never) => string
    requiredRoleCanOverride: boolean
  }
  authOverridingOperations?: [string]
}

export const jwtAlgorithm = 'HS512'

export function createJwt(user: IUser): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const payload = {
      email: user.email,
      role: user.role,
      picture: user.picture,
    }

    jwtSign(
      payload,
      JwtSecret(),
      {
        algorithm: jwtAlgorithm,
        subject: user._id.toHexString(),
        expiresIn: '1d',
      },
      (err: Error | null, encoded: string | undefined) => {
        if (err) {
          reject(err.message)
          return
        }
        resolve(encoded ?? 'no-op')
      }
    )
  })
}

export function authenticate(options?: IAuthOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (
      shouldOverrideAuth(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (req?.body?.operationName as string) ?? 'no-op',
        options?.authOverridingOperations,
        req?.originalUrl
      )
    ) {
      return next()
    }

    try {
      const user = await authenticateHelper(req.headers.authorization)
      authorizeHelper(user, options, req as never)
      res.locals.currentUser = user
      return next()
    } catch (ex) {
      if (ex instanceof Error) {
        return res.status(401).send({ message: ex.message })
      }
    }
  }
}

export function authorizeHelper(
  currentUser: IUser,
  options?: IAuthOptions,
  context?: never
) {
  const permitIfSelf = options?.permitIfSelf
    ? {
        id:
          options?.permitIfSelf?.id ??
          (context ? options?.permitIfSelf?.idGetter?.(context) : ''),
        requiredRoleCanOverride: options?.permitIfSelf.requiredRoleCanOverride,
      }
    : undefined

  if (
    typeof permitIfSelf?.id === 'string' &&
    !currentUser._id.equals(permitIfSelf.id) &&
    !permitIfSelf.requiredRoleCanOverride
  ) {
    throw new Error(CanOnlyEditOwnMessage)
  }

  if (options?.requiredRole && currentUser.role !== options.requiredRole) {
    throw new Error(`${MustHaveRoleMessage}: ${options.requiredRole}`)
  }
}

export function shouldOverrideAuth(
  operationName: string,
  authOverridingOperations?: string[],
  url?: string
) {
  if (operationName === 'no-op' && url?.includes(GraphQLPath)) {
    operationName = GraphQLBaseOperation
  }
  const permissionsList = PermittedOperations.concat(authOverridingOperations ?? [])
  return permissionsList.some((op) => op.toLowerCase() === operationName.toLowerCase())
}

export async function authenticateHelper(authorizationHeader?: string): Promise<User> {
  if (!authorizationHeader) {
    throw new Error(MissingAuthHeaderMessage)
  }

  const payload = jwtVerify(sanitizeToken(authorizationHeader), JwtSecret(), {
    algorithms: [jwtAlgorithm],
  }) as IJwtPayload
  const currentUser = await UserCollection.findOne({
    _id: new ObjectId(payload?.sub),
  })

  if (!currentUser) {
    throw new Error(UserDoesntExistMessage)
  }

  return currentUser
}

function sanitizeToken(authorization: string): string {
  const authString = authorization || ''
  const authParts = authString.split(' ')
  const sanitizedToken = authParts.length === 2 ? authParts[1] : authParts[0]
  return sanitizedToken ?? ''
}
