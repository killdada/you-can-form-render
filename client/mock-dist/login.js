"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
exports.default = {
    // 自动登录
    '/api/v1/login': function (req, res) {
        res.send(util_1.getMockDataByPath('user'));
    },
};
//# sourceMappingURL=login.js.map