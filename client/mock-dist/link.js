"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
exports.default = {
    // 获取本地数据库来源表
    '/api/design/form/table/list': function (req, res) {
        res.send(util_1.getMockDataByPath('database'));
    },
    // 根据选择的本地数据库表名获取字段列表
    '/api/design/form/param/list': function (req, res) {
        var _a = (req || {}).query.tableName, tableName = _a === void 0 ? '' : _a;
        res.send(util_1.getMockDataByPath('databaseDetailByName', tableName));
    },
    // 获取第三方系统来源表
    '/api/design/app/list': function (req, res) {
        res.send(util_1.getMockDataByPath('thirdDataBase'));
    },
    // 根据 appId 应用id获取第三方数据库接口列表
    '/api/v1/activiti/design/app/interface/list': function (req, res) {
        var _a = (req || {}).query.appId, appId = _a === void 0 ? '' : _a;
        res.send(util_1.getMockDataByPath('thirdDataBaseById', appId, []));
    },
    // 之前的linkpage接口，远程数据接口
    'GET /api/design/form/linkage': function (req, res) {
        // 省市区模拟
        var data = util_1.getMockDataByPath('linkpage', req.query.appInterId, {});
        if (typeof req.query.cityId !== 'undefined') {
            data = util_1.getMockDataByPath('city', "areaList." + req.query.cityId, []);
        }
        else if (typeof req.query.provinceId !== 'undefined') {
            data = util_1.getMockDataByPath('city', "cityList." + req.query.provinceId, []);
        }
        else if (typeof req.query.countryId !== 'undefined') {
            data = util_1.getMockDataByPath('city', 'provinceList', []);
        }
        res.send(data);
    },
};
//# sourceMappingURL=link.js.map