"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const app_1 = require("./app");
const userController_1 = require("./controllers/userController");
// Configure all routers here
app_1.default.use('/user', userController_1.default);
exports.Instance = http.createServer(app_1.default);
//# sourceMappingURL=server.js.map