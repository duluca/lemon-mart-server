import { close, connect } from 'document-ts'
import * as dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { JwtSecret } from '../src/config'
import { Role } from '../src/models/enums'
import { IUser, UserCollection } from '../src/models/user'
import { authenticateHelper, createJwt } from '../src/services/authService'
import { initializeDemoUser } from '../src/services/userService'

let mongoServerInstance: MongoMemoryServer
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

const defaultUser: Partial<IUser> = {
  email: 'duluca@gmail.com',
}

const defaultUserId = '5da01751da27cc462d265913'

let accessToken = ''

describe('config', () => {
  beforeAll(() => {
    dotenv.config({ path: 'example.env' })
  })

  it('should authenticate demo user', async () => {
    const test = JwtSecret()
    expect(test).toBeDefined()
  })
})

describe('AuthService', () => {
  beforeAll(() => {
    dotenv.config({ path: 'example.env' })
  })

  beforeEach(async () => {
    mongoServerInstance = new MongoMemoryServer({ instance: { dbName: 'testDb' } })
    const uri = await mongoServerInstance.getUri()
    await connect(uri)
    await initializeDemoUser(defaultUser.email, 'l0l1pop!!', defaultUserId)
    const user = await UserCollection.findOne({ email: defaultUser.email })

    accessToken = await createJwt(user)
  })

  afterEach(async () => {
    await close()
    await mongoServerInstance.stop()
  })

  describe('authenticateHelper', () => {
    it('should authenticate demo user', async () => {
      const user = await authenticateHelper(accessToken)

      expect(user).toBeDefined()
      expect(user._id.equals(defaultUserId)).toBeTrue()
    })

    it('should authenticate demo user as manager', async () => {
      const user = await authenticateHelper(accessToken, { requiredRole: Role.Manager })

      expect(user).toBeDefined()
      expect(user._id.equals(defaultUserId)).toBeTrue()
    })

    it('should authenticate demo user as self', async () => {
      const user = await authenticateHelper(accessToken, {
        requiredRole: Role.Manager,
        permitIfSelf: { id: defaultUserId, requiredRoleCanOverride: false },
      })

      expect(user).toBeDefined()
      expect(user._id.equals(defaultUserId)).toBeTrue()
    })

    it('should authenticate demo user as self', async () => {
      let expectedException: Error

      try {
        await authenticateHelper(accessToken, {
          requiredRole: Role.Cashier,
        })
      } catch (ex) {
        expectedException = ex
      }

      expect(expectedException).toBeDefined()
    })
  })
})
