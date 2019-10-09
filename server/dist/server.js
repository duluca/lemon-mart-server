"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const app_1 = require("./app");
const userRouter_1 = require("./routes/userRouter");
// Configure all routers here
app_1.default.use('/user', userRouter_1.default);
exports.Instance = http.createServer(app_1.default);
//# sourceMappingURL=server.js.map