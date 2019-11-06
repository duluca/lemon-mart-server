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

export async function initializeDefaultUser() {
  const existingUser = await UserCollection.findOne({ email: 'duluca@gmail.com' })

  if (existingUser) {
    console.log('Found existing user... deleting')
    await existingUser.delete()
  }
  // 5da01751da27cc462d265913
  const defaultUser = new User({
    email: 'duluca@gmail.com',
    name: { first: 'Doguhan', last: 'Uluca' },
    picture: 'https://secure.gravatar.com/avatar/7cbaa9afb5ca78d97f3c689f8ce6c985',
    role: Role.Manager,
    dateOfBirth: new Date(1980, 1, 1),
    userStatus: true,
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

  await defaultUser.create('5da01751da27cc462d265913', 'l0l1pop', true)
}
