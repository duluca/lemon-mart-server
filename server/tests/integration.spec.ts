import { close, connect } from 'document-ts'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Role } from '../src/models/enums'
import { IUser, User, UserCollection } from '../src/models/user'

let mongod: MongoMemoryServer
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

describe('Integration', () => {
  beforeEach(async () => {
    const dbName = 'testDb'
    mongod = await MongoMemoryServer.create({ instance: { dbName: dbName } })
    await connect(`${mongod.getUri()}${dbName}}`)
  })

  afterEach(async () => {
    await close()
    await mongod.stop()
  })

  // See DocumentTS for more complete examples of integration tests
  // https://github.com/duluca/DocumentTS/tree/master/tests
  it('should open a connection with a dummy database name', async () => {
    const runningInstance = await mongod.instanceInfo

    expect(runningInstance).toBeTruthy()
  })

  it('should store a user', async () => {
    const expectedException = null
    let actualException = null

    const userData: Partial<IUser> = {
      name: { first: 'Doguhan', last: 'Uluca' },
      email: 'duluca@gmail.com',
      role: Role.Manager,
    }

    try {
      const user = new User(userData)
      await user.create()
    } catch (ex) {
      actualException = ex
    }

    expect(expectedException).toEqual(actualException)
  })

  it('should find with pagination given string skip and limit', async () => {
    const expectedException = null
    let actualException = null
    const expectedRecordCount = 20

    try {
      for (let i = 0; i < expectedRecordCount; i++) {
        const userData: Partial<IUser> = {
          name: { first: `${i}`, last: `${i}` },
          email: `${i}@gmail.com`,
          role: Role.Manager,
        }
        const user = new User(userData)
        await user.create()
      }
    } catch (ex) {
      actualException = ex
    }

    expect(expectedException).toEqual(actualException)

    const dynamicInput = 10

    const results = await UserCollection.findWithPagination<User>({
      skip: dynamicInput,
      limit: dynamicInput,
    })
    expect(expectedRecordCount).toBe(results.total)
    expect(results.data.length).toBe(10)

    expect(results.data[0] ? results.data[0].name.first : 0).toBe('10')
  })
})
