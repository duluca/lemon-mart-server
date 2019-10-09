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
const bcrypt = require("bcryptjs");
const document_ts_1 = require("document-ts");
const uuid_1 = require("uuid");
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *     Users:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           format: int32
 *       items:
 *         $ref: "#/components/schemas/ArrayOfUser"
 *     ArrayOfUser:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/User"
 */
class User extends document_ts_1.Document {
    constructor(email = '', firstName = '', lastName = '', role = '') {
        super(User.collectionName, {
            email,
            firstName,
            lastName,
            role,
        });
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.password = '';
    }
    static Builder(user) {
        if (!user) {
            return new User();
        }
        return new User(user.email, user.firstName, user.lastName, user.role);
    }
    getCalculatedPropertiesToInclude() {
        return ['fullName'];
    }
    getPropertiesToExclude() {
        return ['password'];
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    create(firstName, lastName, email, role, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.role = role;
            if (!password) {
                password = uuid_1.v4();
            }
            this.password = yield this.setPassword(password);
            yield this.save();
        });
    }
    resetPassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            this.password = yield this.setPassword(newPassword);
            yield this.save();
        });
    }
    setPassword(newPassword) {
        return new Promise(function (resolve, reject) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    return reject(err);
                }
                bcrypt.hash(newPassword, salt, function (err, hash) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(hash);
                });
            });
        });
    }
    comparePassword(password) {
        let user = this;
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) {
                    return reject(err);
                }
                resolve(isMatch);
            });
        });
    }
    hasSameId(id) {
        return this._id.toHexString() === id.toHexString();
    }
}
exports.User = User;
User.collectionName = 'users';
class UserCollectionFactory extends document_ts_1.CollectionFactory {
    constructor(docType) {
        super(User.collectionName, docType, ['firstName', 'lastName', 'email']);
    }
    createIndexes() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection().createIndexes([
                {
                    key: {
                        email: 1,
                    },
                    unique: true,
                },
                {
                    key: {
                        firstName: 'text',
                        lastName: 'text',
                        email: 'text',
                    },
                    weights: {
                        lastName: 4,
                        firstName: 2,
                        email: 1,
                    },
                    name: 'TextIndex',
                },
            ]);
        });
    }
    // This is a contrived example for demonstration purposes
    // It is possible to execute far more sophisticated and high performance queries using Aggregation in MongoDB
    // Documentation: https://docs.mongodb.com/manual/aggregation/
    userSearchQuery(searchText) {
        let aggregateQuery = [
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
        ];
        if (searchText === undefined || searchText === '') {
            delete aggregateQuery[0].$match.$text;
        }
        return this.collection().aggregate(aggregateQuery);
    }
}
exports.UserCollection = new UserCollectionFactory(User);
//# sourceMappingURL=user.js.map