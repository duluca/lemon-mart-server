import { ObjectId } from 'mongodb'
import { PhoneType, Role } from '../models/enums'
import { User } from '../models/user'

// create a dummy user
export const dummyUser: User = new User({
  _id: new ObjectId(),
  name: {
    first: 'John',
    last: 'Doe',
  },
  email: 'me@acme.com',
  picture: 'https://picsum.photos/200',
  role: Role.Clerk,
  userStatus: true,
  phones: [
    {
      digits: '555-555-5555',
      type: PhoneType.Mobile,
    },
  ],
  address: {
    line1: '123 Main St.',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
  },
  dateOfBirth: new Date('1980-01-01'),
  level: 1,
})
