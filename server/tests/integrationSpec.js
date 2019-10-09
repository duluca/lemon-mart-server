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
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoServerInstance;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
describe('Integration', function () {
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        mongoServerInstance = new mongodb_memory_server_1.MongoMemoryServer({ instance: { dbName: 'testDb' } });
        const uri = yield mongoServerInstance.getConnectionString();
        yield document_ts_1.connect(uri);
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield document_ts_1.close();
        yield mongoServerInstance.stop();
    }));
    // See DocumentTS for more complete examples of integration tests
    // https://github.com/duluca/DocumentTS/tree/master/tests
    it('should open a connection with a dummy database name', () => __awaiter(this, void 0, void 0, function* () {
        const runningInstance = yield mongoServerInstance.runningInstance;
        expect(runningInstance).toBeTruthy();
    }));
});
//# sourceMappingURL=integrationSpec.js.map