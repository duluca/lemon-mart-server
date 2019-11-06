/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: string
 *       enum: [none, clerk, cashier, manager]
 */
export enum Role {
  None = 'none',
  Clerk = 'clerk',
  Cashier = 'cashier',
  Manager = 'manager',
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneType:
 *       type: string
 *       enum: [none, mobile, home, work]
 */
export enum PhoneType {
  None = 'none',
  Mobile = 'mobile',
  Home = 'home',
  Work = 'work',
}
