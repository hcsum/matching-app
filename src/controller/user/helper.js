"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCosCredential = void 0;
var STS = require("qcloud-cos-sts");
// move to separate file
var config = {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
    bucket: process.env.BUCKET,
    region: process.env.REGION,
    proxy: process.env.Proxy,
    durationSeconds: 1800,
    allowPrefix: "images/*",
    // 密钥的权限列表
    allowActions: [
        // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
        // 关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
        // 简单上传
        "name/cos:PutObject",
        "name/cos:PostObject",
        // 分片上传
        "name/cos:InitiateMultipartUpload",
        "name/cos:ListMultipartUploads",
        "name/cos:ListParts",
        "name/cos:UploadPart",
        "name/cos:CompleteMultipartUpload",
        // 下载对象
        "name/cos:GetObject",
        // 查询对象列表
        "name/cos:GetBucket",
    ],
};
// sts handler
var getCosCredential = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var AppId, policy;
    var _a;
    return __generator(this, function (_b) {
        AppId = (_a = config.bucket) === null || _a === void 0 ? void 0 : _a.slice(config.bucket.lastIndexOf("-") + 1);
        policy = {
            version: "2.0",
            statement: [
                {
                    action: config.allowActions,
                    effect: "allow",
                    resource: [
                        "qcs::cos:".concat(config.region, ":uid/").concat(AppId, ":").concat(config.bucket, "/").concat(config.allowPrefix),
                    ],
                },
            ],
        };
        STS.getCredential({
            secretId: config.secretId,
            secretKey: config.secretKey,
            proxy: config.proxy,
            region: config.region,
            durationSeconds: config.durationSeconds,
            policy: policy,
        }, function (err, tempKeys) {
            var result = JSON.stringify(err || tempKeys) || "";
            res.send(result);
        });
        return [2 /*return*/];
    });
}); };
exports.getCosCredential = getCosCredential;
