"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("./util");
var getDesinData = function (req) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var fileText, formInfo, data;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, util_1.getMockDataByPath('schema', req.params.id)];
            case 1:
                fileText = (_a.sent()).data;
                return [4 /*yield*/, util_1.getMockDataByPath('design', req.params.id)];
            case 2:
                formInfo = (_a.sent()).data;
                data = {
                    formPage: {
                        fileText: JSON.stringify(fileText),
                    },
                    formInfo: tslib_1.__assign(tslib_1.__assign({}, formInfo), { formStr: JSON.stringify(formInfo.formStr) }),
                };
                return [2 /*return*/, data];
        }
    });
}); };
exports.default = {
    // 获取schema信息
    'GET /api/form/schema/:id?': function (req, res) {
        res.send(util_1.getMockDataByPath('schema', req.params.id));
    },
    // GET 可忽略 获取表单详情
    '/api/form/detail/:id?': function (req, res) {
        res.send(util_1.getMockDataByPath('detail', req.params.id));
    },
    // 支持自定义函数，API 参考 express@4, 保存schema信息
    'POST /api/form/schema/:id?': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.saveMockDataByPath('schema', req.body, req.params.id)];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
    // 保存表单详情
    'POST /api/form/detail/:id?': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.saveMockDataByPath('detail', req.body, req.params.id)];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
    // GET 可忽略 获取表单分类
    '/api/design/form/category/list': function (req, res) {
        res.send(util_1.getMockDataByPath('formCategory'));
    },
    // GET 可忽略 获取所有表单列表
    '/api/design/form/base/list': function (req, res) {
        res.send(util_1.getMockDataByPath('formList'));
    },
    // 设计时新增一个表单
    'POST /api/design/form/add': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a, allSchema, allSchemaArr, id, _b, fileText, other, _c, formStr, data;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, util_1.getMockDataByPath('schema')];
                case 1:
                    _a = (_d.sent()).data, allSchema = _a === void 0 ? {} : _a;
                    allSchemaArr = Object.keys(allSchema) || [];
                    id = parseInt(allSchemaArr[allSchemaArr.length - 1] || '0', 10);
                    _b = req.body, fileText = _b.fileText, other = tslib_1.__rest(_b, ["fileText"]);
                    _c = other || {}, formStr = _c.formStr, data = tslib_1.__rest(_c, ["formStr"]);
                    // schema数据 以前的formPage.fileText
                    return [4 /*yield*/, util_1.saveMockDataByPath('schema', JSON.parse(fileText), id + 1)];
                case 2:
                    // schema数据 以前的formPage.fileText
                    _d.sent();
                    // design数据 以前的formInfo.formStr 字段列表描述等
                    return [4 /*yield*/, util_1.saveMockDataByPath('design', tslib_1.__assign(tslib_1.__assign({}, data), { formStr: JSON.parse(formStr) }), id + 1)];
                case 3:
                    // design数据 以前的formInfo.formStr 字段列表描述等
                    _d.sent();
                    res.send({
                        status: 0,
                        msg: '新增成功',
                    });
                    return [2 /*return*/];
            }
        });
    }); },
    // 获取设计时表单数据结构
    'POST /api/design/form/update': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a, fileText, id, other, _b, formStr, data;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.body, fileText = _a.fileText, id = _a.id, other = tslib_1.__rest(_a, ["fileText", "id"]);
                    _b = other || {}, formStr = _b.formStr, data = tslib_1.__rest(_b, ["formStr"]);
                    // schema数据 以前的formPage.fileText
                    return [4 /*yield*/, util_1.saveMockDataByPath('schema', JSON.parse(fileText), id)];
                case 1:
                    // schema数据 以前的formPage.fileText
                    _c.sent();
                    // design数据 以前的formInfo.formStr 字段列表描述等
                    return [4 /*yield*/, util_1.saveMockDataByPath('design', tslib_1.__assign(tslib_1.__assign({}, data), { formStr: JSON.parse(formStr) }), id)];
                case 2:
                    // design数据 以前的formInfo.formStr 字段列表描述等
                    _c.sent();
                    // 分开来保存
                    res.send({
                        status: 0,
                        msg: '保存成功',
                    });
                    return [2 /*return*/];
            }
        });
    }); },
    // 获取运行时表单数据结构
    '/api/design/form/detail/:id?': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data, businessData, processRecord;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDesinData(req)];
                case 1:
                    data = _a.sent();
                    businessData = util_1.getMockDataByPath('detail', req.params.id, {}).data;
                    processRecord = util_1.getMockDataByPath('processRecord', req.params.id, {}).data;
                    res.send({
                        status: 0,
                        data: tslib_1.__assign(tslib_1.__assign({}, data), { businessData: businessData, processRecord: processRecord }),
                    });
                    return [2 /*return*/];
            }
        });
    }); },
    // 获取设计时表单数据结构
    '/api/design/form/get/:id?': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDesinData(req)];
                case 1:
                    data = _a.sent();
                    res.send({
                        status: 0,
                        data: data,
                    });
                    return [2 /*return*/];
            }
        });
    }); },
    // 申请审批表检验是否有提交权限
    'POST /api/v1/activiti/design/message/check': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            // 返回status 0 有权限
            res.send({
                status: 0,
                data: '',
            });
            return [2 /*return*/];
        });
    }); },
};
//# sourceMappingURL=form.js.map