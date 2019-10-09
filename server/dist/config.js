"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = process.env.NODE_ENV === 'production';
exports.port = process.env.PORT || 3000;
exports.mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/lemon-mart';
//# sourceMappingURL=config.js.map