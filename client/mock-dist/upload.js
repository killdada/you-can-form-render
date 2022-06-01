"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("./util");
exports.default = {
    // 内网图片获取可访问的url地址
    'GET /api/v1/getFile': function (req, res) {
        res.send(util_1.getMockDataByPath('upload', req.query.fileName));
    },
    // 上传图片，内网
    'POST /api/v1/uploadFile': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.getMockDataByPath('upload', 'upload')];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
    // 上传图片，外网
    'POST /api/v1/uploadPublicPicture': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.getMockDataByPath('upload', 'uploadPublic')];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
};
//# sourceMappingURL=upload.js.map