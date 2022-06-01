"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("./util");
exports.default = {
    // 获取公司部门组织架构
    'POST /api/v1/aaaCenter/listDepartmentRelation': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.getMockDataByPath('org')];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
    // 获取公司部门员工情况
    'POST /api/v1/aaaCenter/listEmployeeRelation': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.getMockDataByPath('staff')];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
};
//# sourceMappingURL=common.js.map