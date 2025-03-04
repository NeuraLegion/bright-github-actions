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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const http_client_1 = require("@actions/http-client");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiToken = (0, core_1.getInput)('api_token', { required: true });
            const hostname = (0, core_1.getInput)('hostname');
            const projectId = (0, core_1.getInput)('project_id', { required: true });
            const limit = (0, core_1.getInput)('limit');
            const baseUrl = hostname || 'https://app.brightsec.com';
            const client = new http_client_1.HttpClient('GitHub Actions', undefined, {
                headers: {
                    Authorization: `api-key ${apiToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const entrypoints = [];
            let nextId;
            let nextCreatedAt;
            do {
                const params = new URLSearchParams();
                params.append('projectId', projectId);
                if (limit) {
                    params.append('limit', limit);
                }
                if (nextId) {
                    params.append('nextId', nextId);
                }
                if (nextCreatedAt) {
                    params.append('nextCreatedAt', nextCreatedAt);
                }
                const response = yield client.get(`${baseUrl}/api/v1/entrypoints?${params.toString()}`);
                const responseBody = yield response.readBody();
                const data = JSON.parse(responseBody);
                entrypoints.push(...data.items);
                nextId = data.nextId;
                nextCreatedAt = data.nextCreatedAt;
            } while (nextId && nextCreatedAt);
            (0, core_1.setOutput)('entrypoints', JSON.stringify(entrypoints));
            (0, core_1.setOutput)('projectId', projectId);
        }
        catch (error) {
            if (error instanceof Error) {
                (0, core_1.setFailed)(error.message);
            }
            else {
                (0, core_1.setFailed)('An unknown error occurred');
            }
        }
    });
}
void run();
