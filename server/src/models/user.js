"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const document_ts_1 = require("document-ts");
const uuid_1 = require("uuid");
var bcrypt = require('bcryptjs');
class User extends document_ts_1.Document {
    constructor(email = '', firstName = '', lastName = '', role = '') {
        super(User.collectionName, { email, firstName, lastName, role });
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
User.collectionName = 'users';
exports.User = User;
class UserCollectionFactory extends document_ts_1.CollectionFactory {
    constructor(docType) {
        super(User.collectionName, docType, ['firstName', 'lastName', 'email']);
    }
}
exports.UserCollection = new UserCollectionFactory(User);
//# sourceMappingURL=user.js.map