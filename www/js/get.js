/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2022 Yannick Deubel
 * @license   {@link https://github.com/yandeu/docker-swarm-visualizer/blob/main/LICENSE LICENSE}
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const agentsDns = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = '/api/dev/agents/dns';
        const res = yield fetch(url);
        const json = yield res.json();
        return json;
    }
    catch (err) {
        console.error(err.message);
        return [];
    }
});
const nodes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = '/api/dev/nodes';
        const res = yield fetch(url);
        const json = yield res.json();
        return json;
    }
    catch (err) {
        console.error(err.message);
        return null;
    }
});
const info = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `/api/dev/${ip}/info`;
        const res = yield fetch(url);
        const json = yield res.json();
        return json;
    }
    catch (err) {
        console.error(err.message);
        return null;
    }
});
const containers = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `/api/dev/${ip}/containers`;
        const res = yield fetch(url);
        const json = yield res.json();
        return json;
    }
    catch (err) {
        console.error(err.message);
        return null;
    }
});
export const get = {
    agentsDns,
    containers,
    nodes,
    info
};
