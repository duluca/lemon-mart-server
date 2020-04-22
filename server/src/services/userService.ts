import { PhoneType, Role } from '../models/enums'
import { IUser, User, UserCollection } from '../models/user'

export async function createNewUser(userData: IUser): Promise<User | boolean> {
  const user = new User(userData)
  const success = await user.save()
  if (success) {
    return user
  } else {
    return false
  }
}

export async function initializeDemoUser(email: string, password: string, id: string) {
  // This function loads a demo user.
  // In a production application you would seed admin users in a similar way (except for the user id).

  const existingUser = await UserCollection.findOne({ email })

  if (existingUser) {
    console.log('Found existing user... deleting')
    await existingUser.delete()
  }

  const defaultUser = new User({
    email,
    name: { first: 'Doguhan', last: 'Uluca' },
    picture: 'https://secure.gravatar.com/avatar/7cbaa9afb5ca78d97f3c689f8ce6c985',
    role: Role.Manager,
    dateOfBirth: new Date(1980, 1, 1),
    userStatus: true,
    level: 2,
    address: {
      line1: '101 Sesame St.',
      city: 'Bethesda',
      state: 'Maryland',
      zip: '20810',
    },
    phones: [
      {
        type: PhoneType.Mobile,
        digits: '5555550717',
      },
    ],
  })

  await defaultUser.create(id, password, true)
}
