import { GraphQLError } from 'graphql'

import { IUser } from '../models/user'
import {
  AuthenticationRequiredMessage,
  IAuthOptions,
  authorizeHelper,
} from '../services/authService'

export interface IAuthContext {
  currentUser?: IUser
}

export function authorize(contextValue: IAuthContext, options?: IAuthOptions): IUser {
  const user = contextValue.currentUser

  try {
    if (!user) {
      throw new Error(AuthenticationRequiredMessage)
    }

    if (options?.permitIfSelf) {
      options.permitIfSelf.id = user._id.toString()
    }

    authorizeHelper(user, options)
  } catch (error) {
    const errorString = error instanceof Error ? error.message : (error as string)
    throw new GraphQLError(errorString, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    })
  }
  return user
}
