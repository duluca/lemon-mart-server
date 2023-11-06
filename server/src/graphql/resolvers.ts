import { EnumValues } from 'enum-values'

import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import { ObjectId } from 'mongodb'
import { PhoneType, Role } from '../models/enums'
import { IUser, User, UserCollection } from '../models/user'
import { IncorrectEmailPasswordMessage, createJwt } from '../services/authService'
import { createNewUser } from '../services/userService'
import { Users } from './generated/graphql'
import { IAuthContext, authorize } from './helpers'

export const resolvers = {
  Query: {
    me: (_parent: never, _args, contextValue: IAuthContext) => authorize(contextValue),
    user: (_parent: never, args: { id: string }, contextValue: IAuthContext) => {
      authorize(contextValue, {
        requiredRole: Role.Manager,
        permitIfSelf: {
          requiredRoleCanOverride: true,
        },
      })
      return UserCollection.findOne({
        _id: new ObjectId(args.id),
      })
    },
    users: (
      _parent: never,
      args: { filter: string; limit: number; skip: number; sortKey: string },
      contextValue: IAuthContext,
      info: GraphQLResolveInfo
    ) => {
      authorize(contextValue, { requiredRole: Role.Manager })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      console.log(Object.keys(graphqlFields(info)['data'])) // requested fields

      return UserCollection.findWithPagination<User>({
        filter: args.filter,
        limit: args.limit,
        skip: args.skip,
        sortKeyOrList: args.sortKey ? [args.sortKey] : 'name',
        // TODO: Projection needs to be driven by GraphQL query selection
        projectionKeyOrList: ['email', 'role', '_id', 'name'],
      })
    },
  },
  Mutation: {
    login: async (_parent: never, args: { email: string; password: string }) => {
      const userEmail = args.email
      const password = args.password

      if (typeof userEmail === 'string' && typeof password === 'string') {
        const user = await UserCollection.findOne({
          email: userEmail.toLowerCase(),
        })

        if (user && (await user.comparePassword(password))) {
          return { accessToken: await createJwt(user) }
        }
      }

      return { message: IncorrectEmailPasswordMessage }
    },
    createUser: (
      _parent: never,
      args: { userInput: IUser },
      contextValue: IAuthContext
    ) => {
      authorize(contextValue, { requiredRole: Role.Manager })
      return createNewUser(args.userInput)
    },
    updateUser: async (
      _parent: never,
      args: { id: string; userInput: User },
      contextValue: IAuthContext
    ) => {
      authorize(contextValue, {
        requiredRole: Role.Manager,
        permitIfSelf: {
          requiredRoleCanOverride: true,
        },
      })
      const userData = args.userInput
      userData._id = new ObjectId(args.id)
      await UserCollection.findOneAndUpdate(
        { _id: userData._id },
        {
          $set: userData,
        }
      )

      return await UserCollection.findOne({
        _id: new ObjectId(args.id),
      })
    },
  },
  User: {
    id: (obj: User) => obj._id.toString(),
    role: (obj: User) => EnumValues.getNameFromValue(Role, obj.role),
    phones: (obj: User) => (obj.phones ? wrapAsArray(obj.phones) : []),
    dateOfBirth: (obj: User) => obj.dateOfBirth?.toISOString(),
  },
  Phone: {
    type: (obj: { type: string }) => EnumValues.getNameFromValue(PhoneType, obj.type),
  },
  Users: {
    data: (obj: Users) => (obj.data ? wrapAsArray(obj.data) : []),
  },
}

function wrapAsArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item]
}
