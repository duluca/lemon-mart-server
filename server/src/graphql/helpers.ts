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

// export function getTopLevelFields(info: GraphQLResolveInfo): string[] {
//   return info.fieldNodes.reduce((all: string[], currentNode) => {
//     all.push(
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//       ...currentNode.selectionSet.selections.map((selection) => {
//         //selection.directives.map((directive) => { directive.name.value })
//         // or if selection.selectionSet is present, we can recursively get it's name.value, ('c' in this example)
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
//         return selection.name.value
//       })
//     )
//     return all
//   }, [])
// }
