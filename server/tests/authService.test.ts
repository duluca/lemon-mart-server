import { afterEach, beforeAll, beforeEach, describe, expect, test } from '@jest/globals'

import { close, connect } from 'document-ts'
import * as dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { JwtSecret } from '../src/config'
import { GraphQLPath } from '../src/graphql/api.graphql'
import { authorize } from '../src/graphql/helpers'
import { Role } from '../src/models/enums'
import { IUser, UserCollection } from '../src/models/user'
import {
  authenticateHelper,
  authorizeHelper,
  createJwt,
  shouldOverrideAuth,
} from '../src/services/authService'
import { initializeDemoUser } from '../src/services/userService'

let mongoServerInstance: MongoMemoryServer

const defaultUser: Partial<IUser> = {
  email: 'duluca@gmail.com',
}

const defaultUserId = '5da01751da27cc462d265913'

let accessToken = ''

describe('config', () => {
  beforeAll(() => {
    dotenv.config({ path: 'example.env' })
  })

  test('should authenticate demo user', async () => {
    const test = JwtSecret()
    expect(test).toBeDefined()
  })
})

describe('AuthService', () => {
  beforeAll(() => {
    dotenv.config({ path: 'example.env' })
  })

  beforeEach(async () => {
    mongoServerInstance = await MongoMemoryServer.create({
      instance: { dbName: 'testDb' },
    })
    await connect(mongoServerInstance.getUri())
    await initializeDemoUser(defaultUser.email, 'l0l1pop!!', defaultUserId)
    const user = await UserCollection.findOne({ email: defaultUser.email })

    accessToken = await createJwt(user)
  })

  afterEach(async () => {
    await close()
    await mongoServerInstance.stop()
  })

  describe('authenticateHelper', () => {
    test('should authenticate demo user', async () => {
      const user = await authenticateHelper(accessToken)

      expect(user).toBeDefined()
      expect(user._id.equals(defaultUserId)).toBe(true)
    })

    test('should authenticate demo user as manager', async () => {
      const user = await authenticateHelper(accessToken)
      authorizeHelper(user, {
        requiredRole: Role.Manager,
      })

      expect(user).toBeDefined()
      expect(user._id.equals(defaultUserId)).toBe(true)
    })

    test('should authenticate demo user as self', async () => {
      const user = await authenticateHelper(accessToken)
      authorizeHelper(user, {
        requiredRole: Role.Manager,
        permitIfSelf: { id: defaultUserId, requiredRoleCanOverride: false },
      })

      expect(user).toBeDefined()
      expect(user._id.equals(defaultUserId)).toBe(true)
    })

    test('should authenticate demo user as cashier', async () => {
      let expectedException: Error

      try {
        const user = await authenticateHelper(accessToken)
        authorizeHelper(user, {
          requiredRole: Role.Cashier,
        })
      } catch (ex) {
        if (ex instanceof Error) {
          expectedException = ex
        }
      }

      expect(expectedException).toBeDefined()
    })
    describe('authorizeHelper', () => {
      test('should authorize demo user as manager', async () => {
        const user = await authenticateHelper(accessToken)
        authorizeHelper(user, {
          requiredRole: Role.Manager,
        })

        expect(user).toBeDefined()
        expect(user._id.equals(defaultUserId)).toBe(true)
      })

      test('should authorize demo user as self', async () => {
        const user = await authenticateHelper(accessToken)
        authorizeHelper(user, {
          requiredRole: Role.Manager,
          permitIfSelf: { id: defaultUserId, requiredRoleCanOverride: false },
        })

        expect(user).toBeDefined()
        expect(user._id.equals(defaultUserId)).toBe(true)
      })

      test('should authorize demo user as cashier', async () => {
        let expectedException: Error

        try {
          const user = await authenticateHelper(accessToken)
          authorizeHelper(user, {
            requiredRole: Role.Cashier,
          })
        } catch (ex) {
          if (ex instanceof Error) {
            expectedException = ex
          }
        }

        expect(expectedException).toBeDefined()
      })
    })
    describe('createJwt', () => {
      test('should create JWT for demo user', async () => {
        const user = await UserCollection.findOne({ email: defaultUser.email })
        const token = await createJwt(user)

        expect(token).toBeDefined()
      })
    })
    describe('shouldOverrideAuth', () => {
      test('should override auth for Login operation', async () => {
        const authOverridingOperations = ['Login']
        const result = shouldOverrideAuth('Login', authOverridingOperations)

        expect(result).toBe(true)
      })

      test('should override auth for login operation', async () => {
        const authOverridingOperations = ['Login']
        const result = shouldOverrideAuth('login', authOverridingOperations)

        expect(result).toBe(true)
      })

      test('should not override auth for login operation', async () => {
        const result = shouldOverrideAuth('login')

        expect(result).toBe(false)
      })

      test('should override auth for no-op operation from graphql', async () => {
        const operationName = 'no-op'
        const result = shouldOverrideAuth(operationName, undefined, GraphQLPath)

        expect(result).toBe(true)
      })

      test('should not override auth for no-op operation from non-graphql', async () => {
        const operationName = 'no-op'
        const result = shouldOverrideAuth(operationName, undefined, '/v1/auth/me')

        expect(result).toBe(false)
      })
    })
    describe('GraphQL authorize', () => {
      test('should authorize demo user as manager', async () => {
        const user = await authenticateHelper(accessToken)
        const result = authorize({ currentUser: user }, { requiredRole: Role.Manager })

        expect(result).toBeDefined()
        expect(result._id.equals(defaultUserId)).toBe(true)
      })
      // suggest more test cases to test authorize
      test('should authorize demo user as self', async () => {
        const user = await authenticateHelper(accessToken)
        const result = authorize(
          { currentUser: user },
          {
            requiredRole: Role.Manager,
            permitIfSelf: { id: defaultUserId, requiredRoleCanOverride: false },
          }
        )

        expect(result).toBeDefined()
        expect(result._id.equals(defaultUserId)).toBe(true)
      })
      test('should authorize demo user as cashier', async () => {
        let expectedException: Error

        try {
          const user = await authenticateHelper(accessToken)
          authorize({ currentUser: user }, { requiredRole: Role.Cashier })
        } catch (ex) {
          if (ex instanceof Error) {
            expectedException = ex
          }
        }

        expect(expectedException).toBeDefined()
      })
      // test if user is not defined
      test('should not authorize demo user as manager', async () => {
        const user = undefined
        let expectedException: Error

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          authorize({ currentUser: user }, { requiredRole: Role.Manager })
        } catch (ex) {
          if (ex instanceof Error) {
            expectedException = ex
          }
        }

        expect(expectedException).toBeDefined()
      })
    })
  })
})
