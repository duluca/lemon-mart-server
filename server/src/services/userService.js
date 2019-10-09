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
const user_1 = require("../models/user");
function createNewUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: mongo transaction
        let user = user_1.User.Builder(userData);
        let success = yield user.save();
        if (success) {
            return user;
        }
        else {
            return false;
        }
    });
}
exports.createNewUser = createNewUser;
//# sourceMappingURL=userService.js.map