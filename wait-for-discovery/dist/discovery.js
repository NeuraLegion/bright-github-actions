"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDiscovery = exports.getStatus = void 0;
const axios_1 = __importDefault(require("axios"));
const getStatus = async (uuid, projectId, options) => {
    const res = await axios_1.default.get(`${options.baseUrl}/api/v2/projects/${projectId}/discoveries/${uuid}`, {
        headers: { authorization: `api-key ${options.token}` }
    });
    const { data } = res;
    return data;
};
exports.getStatus = getStatus;
const stopDiscovery = async (uuid, projectId, options) => {
    try {
        await axios_1.default.post(`${options.baseUrl}/api/v2/projects/${projectId}/discoveries/${uuid}/lifecycle`, { action: 'stop' }, {
            headers: { authorization: `api-key ${options.token}` }
        });
    }
    catch {
        // noop
    }
};
exports.stopDiscovery = stopDiscovery;
