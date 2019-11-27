import * as bcrypt from 'bcryptjs'
import { CollectionFactory, Document, IDocument } from 'document-ts'
import { AggregationCursor, ObjectID } from 'mongodb'
import { v4 as uuid } from 'uuid'

import { Role } from '../models/enums'
import { IPhone, Phone } from './phone'

// import { Role } from '../../../web-app/src/app/auth/role.enum'

// import { IName, IUser } from '../../../web-app/src/app/user/user/user'
// export interface IDbUser extends IUser, IDocument {}

export interface IName {
  first: string
  middle?: string
  last: string
}

export interface IUser extends IDocument {
  email: string
  name: IName
  picture: string
  role: Role
  userStatus: boolean
  dateOfBirth: Date
  level: number
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
  }
  phones?: IPhone[]
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Name:
 *       type: object
 *       properties:
 *         first:
 *           type: string
 *         middle:
 *           type: string
 *         last:
 *           type: string
 *       required:
 *         - first
 *         - last
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           $ref: "#/components/schemas/Name"
 *         picture:
 *           type: string
 *         role:
 *           $ref: "#/components/schemas/Role"
 *         userStatus:
 *           type: boolean
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         level:
 *           type: number
 *         address:
 *           type: object
 *           properties:
 *             line1:
 *               type: string
 *             line2:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zip:
 *               type: string
 *           required:
 *             - line1
 *             - city
 *             - state
 *             - zip
 *         phones:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Phone"
 *       required:
 *         - email
 *         - name
 *         - role
 *         - userStatus
 */
export class User extends Document<IUser> implements IUser {
  static collectionName = 'users'
  private password: string
  public email: string
  public name: IName
  public picture: string
  public role: Role
  public dateOfBirth: Date
  public userStatus: boolean
  public level: number
  public address: {
    line1: string
    city: string
    state: string
    zip: string
  }

  public phones?: IPhone[]

  constructor(user?: Partial<IUser>) {
    super(User.collectionName, user)
  }

  fillData(data?: Partial<IUser>) {
    if (data) {
      Object.assign(this, data)
    }

    if (this.phones) {
      this.phones = this.hydrateInterfaceArray(Phone, Phone.Build, this.phones)
    }
  }

  getCalculatedPropertiesToInclude(): string[] {
    return ['fullName']
  }

  getPropertiesToExclude(): string[] {
    return ['password']
  }

  public get fullName(): string {
    if (this.name.middle) {
      return `${this.name.first} ${this.name.middle} ${this.name.last}`
    }
    return `${this.name.first} ${this.name.last}`
  }

  async create(id?: string, password?: string, upsert = false) {
    if (id) {
      this._id = new ObjectID(id)
    }

    if (!password) {
      password = uuid()
    }

    this.password = await this.setPassword(password)
    await this.save({ upsert })
  }

  async resetPassword(newPassword: string) {
    this.password = await this.setPassword(newPassword)
    await this.save()
  }

  private setPassword(newPassword: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return reject(err)
        }
        bcrypt.hash(newPassword, salt, (hashError, hash) => {
          if (hashError) {
            return reject(hashError)
          }
          resolve(hash)
        })
      })
    })
  }

  comparePassword(password: string): Promise<boolean> {
    const user = this
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return reject(err)
        }
        resolve(isMatch)
      })
    })
  }

  hasSameId(id: ObjectID): boolean {
    return this._id.toHexString() === id.toHexString()
  }
}

class UserCollectionFactory extends CollectionFactory<User> {
  constructor(docType: typeof User) {
    super(User.collectionName, docType, ['name.first', 'name.last', 'email'])
  }

  async createIndexes() {
    await this.collection().createIndexes([
      {
        key: {
          email: 1,
        },
        unique: true,
      },
      {
        key: {
          'name.first': 'text',
          'name.last': 'text',
          email: 'text',
        },
        weights: {
          'name.last': 4,
          'name.first': 2,
          email: 1,
        },
        name: 'TextIndex',
      },
    ])
  }

  // This is a contrived example for demonstration purposes
  // It is possible to execute far more sophisticated and
  // high performance queries using Aggregation in MongoDB
  // Documentation: https://docs.mongodb.com/manual/aggregation/
  userSearchQuery(
    searchText: string
  ): AggregationCursor<{ _id: ObjectID; email: string }> {
    const aggregateQuery = [
      {
        $match: {
          $text: { $search: searchText },
        },
      },
      {
        $project: {
          email: 1,
        },
      },
    ]

    if (searchText === undefined || searchText === '') {
      delete (aggregateQuery[0] as any).$match.$text
    }

    return this.collection().aggregate(aggregateQuery)
  }
}

export let UserCollection = new UserCollectionFactory(User)
