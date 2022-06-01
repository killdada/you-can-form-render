"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("./util");
exports.default = {
    // 支持自定义函数，API 参考 express@4, 流程撤回
    'POST /api/design/proc/recall': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            res.send({
                status: 0,
                data: '流程撤回成功',
            });
            return [2 /*return*/];
        });
    }); },
    // 表单提交保存草稿
    'POST /api/design/proc/save': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.saveMockDataByPath('detail', req.body.formMap, req.body.formId)];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
    // 自定义表单提交数据
    'POST /api/v1/activiti/design/proc/submit': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.saveMockDataByPath('detail', req.body.formMap, req.body.formId)];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
    // 审批接口
    'POST /api/design/proc/approve': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.saveMockDataByPath('detail', req.body.formMap, req.body.formId)];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
    // 加签
    'POST /api/design/proc/joint': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            res.send({
                status: 0,
                data: '加签成功',
            });
            return [2 /*return*/];
        });
    }); },
    // 转签
    'POST /api/design/proc/change': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            res.send({
                status: 0,
                data: '转签成功',
            });
            return [2 /*return*/];
        });
    }); },
    //  获取审批历史列表
    '/api/v1/activiti/approveLog': function (req, res) {
        res.send(util_1.getMockDataByPath('approveLogs'));
    },
    // 获取历史用户任务节点列表（用于退回指定节点选择）
    '/api/design/proc/history/:taskId': function (req, res) {
        res.send(util_1.getMockDataByPath('taskList', req.params.taskId, []));
    },
    // 用户个人审批意见列表添加
    'POST /api/v1/activiti/design/opinion/save': function (req, res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_1.saveMockDataByPath('commentList', (req.body.opinions || []).map(function (item, index) {
                        return {
                            id: index,
                            createAt: Date.now(),
                            createBy: 1,
                            opinionInfo: item,
                            status: 0,
                            updateAt: Date.now(),
                            userId: 1,
                        };
                    }))];
                case 1:
                    data = _a.sent();
                    res.send(data);
                    return [2 /*return*/];
            }
        });
    }); },
    // 用户个人审批意见列表查询
    '/api/v1/activiti/design/opinion/list': function (req, res) {
        res.send(util_1.getMockDataByPath('commentList'));
    },
};
//# sourceMappingURL=flow.js.map