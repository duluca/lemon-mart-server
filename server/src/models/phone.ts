import { ISerializable, SerializationStrategy, Serialize } from 'document-ts'

import { PhoneType } from './enums'

export interface IPhone {
  type: PhoneType
  digits: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Phone:
 *       type: object
 *       properties:
 *         type:
 *           $ref: "#/components/schemas/PhoneType"
 *         digits:
 *           type: string
 *       required:
 *         - type
 *         - digits
 */
export class Phone implements IPhone, ISerializable {
  constructor(public type = PhoneType.None, public digits = '') {}

  static Build(phone: Partial<IPhone>) {
    return new Phone(phone.type, phone.digits)
  }

  toJSON(): object {
    const keys = Object.keys(this)
    return Serialize(SerializationStrategy.JSON, this, keys)
  }
  toBSON(): object {
    const keys = Object.keys(this)
    return Serialize(SerializationStrategy.BSON, this, keys)
  }
}
