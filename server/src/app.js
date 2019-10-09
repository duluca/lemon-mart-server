"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/docs', express.static('docs'));
app.route('/').get(function (req, res) {
    res.send('Server is up and running. Web app is hosted <a href="http://localhost:8080">here</a>.');
});
exports.default = app;
//# sourceMappingURL=app.js.map