"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const express_1 = require("express");
const userService_1 = require("../services/userService");
const router = express_1.Router();
/**
 * @swagger
 * components:
 *   parameters:
 *     offsetParam:
 *       in: query
 *       name: offset
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 0
 *       description: The number of items to skip before starting to collect the result set.
 *     limitParam:
 *       in: query
 *       name: limit
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 50
 *         default: 20
 *       description: The numbers of items to return.
 */
/**
 * @swagger
 * /user:
 *     get:
 *       description: |
 *         Searches and returns `User` objects.
 *       parameters:
 *         - in: query
 *           name: search
 *           required: false
 *           schema:
 *             type: string
 *           description: Search text
 *         - $ref: '#/components/parameters/offsetParam'
 *         - $ref: '#/components/parameters/limitParam'
 *       responses:
 *         "200": # Response
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Users"
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield user_1.UserCollection.findWithPagination(req.query, undefined, req.query.filter, undefined, true);
    res.send(users);
}));
/**
 * @swagger
 * /user/{id}:
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
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.UserCollection.findOne({ _id: req.params.userId });
    if (!user) {
        return res.status(404).send({ message: 'User not found.' });
    }
    res.send(user);
}));
/**
 * @swagger
 * /user:
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
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userData = req.body;
    let success = yield userService_1.createNewUser(userData);
    if (success instanceof user_1.User) {
        res.send(success);
    }
    else {
        res.status(400).send({ message: 'Failed to create user.' });
    }
}));
exports.default = router;
//# sourceMappingURL=userRouter.js.map