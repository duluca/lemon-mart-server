import { IQueryParameters } from 'document-ts'
import { Request, Response, Router } from 'express'
import { ObjectId } from 'mongodb'
import { Role } from '../../models/enums'
import { IUser, User, UserCollection } from '../../models/user'
import { authenticate } from '../../services/authService'
import { createNewUser } from '../../services/userService'

const router = Router()

const FailedToCreateUserMessage = 'Failed to create user.'
const UserNotFoundMessage = 'User not found.'

/**
 * @openapi
 * components:
 *   parameters:
 *     filterParam:
 *       in: query
 *       name: filter
 *       required: false
 *       schema:
 *         type: string
 *       description: Search text to filter the result set by
 *     skipParam:
 *       in: query
 *       name: skip
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 0
 *       description: The number of items to skip before collecting the result set.
 *     limitParam:
 *       in: query
 *       name: limit
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 50
 *         default: 10
 *       description: The numbers of items to return.
 *     sortKeyParam:
 *       in: query
 *       name: sortKey
 *       required: false
 *       schema:
 *         type: string
 *       description: Name of a column to sort ascending.
 *                    Prepend column name with a dash to sort descending.
 */

/**
 * @openapi
 * /v2/users:
 *   get:
 *     description: |
 *       Searches, sorts, paginates and returns a summary of `User` objects.
 *     parameters:
 *       - $ref: '#/components/parameters/filterParam'
 *       - $ref: '#/components/parameters/skipParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/sortKeyParam'
 *     responses:
 *       "200": # Response
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fullName:
 *                         type: string
 *                       name:
 *                         $ref: "#/components/schemas/Name"
 *                       role:
 *                         $ref: "#/components/schemas/Role"
 *                     description: Summary of `User` object.
 */
router.get(
  '/',
  authenticate({ requiredRole: Role.Manager }),
  async (req: Request, res: Response) => {
    const query: Partial<IQueryParameters> = {
      filter: req.query.filter as string,
      limit: Number(req.query.limit),
      skip: Number(req.query.skip),
      sortKeyOrList: req.query.sortKey ? [req.query.sortKey as string] : 'name',
      projectionKeyOrList: ['email', 'role', '_id', 'name'],
    }

    const users = await UserCollection.findWithPagination<User>(query)
    res.send(users)
  }
)

/**
 * @openapi
 * /v2/users:
 *   post:
 *     summary: Create a new `User`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *        '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
router.post(
  '/',
  authenticate({ requiredRole: Role.Manager }),
  async (req: Request, res: Response) => {
    const userData = req.body as IUser
    const success = await createNewUser(userData)
    if (success instanceof User) {
      res.send(success)
    } else {
      res.status(400).send({ message: FailedToCreateUserMessage })
    }
  }
)

/**
 * @openapi
 * /v2/users/{id}:
 *   get:
 *     description: Gets a `User` object by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User's unique id
 *     responses:
 *        '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
router.get(
  '/:userId',
  authenticate({
    requiredRole: Role.Manager,
    permitIfSelf: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      idGetter: (req: Request) => req.body._id,
      requiredRoleCanOverride: true,
    },
  }),
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOne({
      _id: new ObjectId(req.params.userId),
    })
    if (!user) {
      res.status(404).send({ message: UserNotFoundMessage })
    } else {
      res.send(user)
    }
  }
)

/**
 * @openapi
 * /v2/users/{id}:
 *   put:
 *     summary: Updates an existing `User`
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User's unique id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *        '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
router.put(
  '/:userId',
  authenticate({
    requiredRole: Role.Manager,
    permitIfSelf: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      idGetter: (req: Request) => req?.body?._id,
      requiredRoleCanOverride: true,
    },
  }),
  async (req: Request, res: Response) => {
    const userData = req.body as User
    userData._id = new ObjectId(req.params.userId)
    await UserCollection.findOneAndUpdate(
      { _id: userData._id },
      {
        $set: userData,
      }
    )

    const user = await UserCollection.findOne({
      _id: new ObjectId(req.params.userId),
    })

    if (!user) {
      res.status(404).send({ message: UserNotFoundMessage })
    } else {
      res.send(user)
    }
  }
)

export default router
