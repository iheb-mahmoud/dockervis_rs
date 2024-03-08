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
import { ipToId, addOrangeCircle, toGiB } from './misc.js';
import { get } from './get.js';
import { elements } from './elements.js';
const nodesHTML = document.getElementById('nodes');
const addNodes = (nodes) => __awaiter(void 0, void 0, void 0, function* () {
    // create nodes
    nodes.forEach(node => {
        const nodeHTML = elements.node(node).trim();
        const template = document.createElement('template');
        template.innerHTML = nodeHTML;
        const html = template.content.firstChild;
        // do add if it does not already exist
        if (!document.getElementById(html.id)) {
            if (nodesHTML) {
                nodesHTML.appendChild(html);
                // open uploader
                const uploadAction = html === null || html === void 0 ? void 0 : html.querySelector('.upload-action');
                if (uploadAction) {
                    const listener = () => {
                        const dropWrapper = document.getElementById('drop-wrapper');
                        if (dropWrapper)
                            dropWrapper.classList.toggle('is-hidden');
                    };
                    uploadAction.removeEventListener('click', listener);
                    uploadAction.addEventListener('click', listener);
                }
            }
        }
    });
    return nodes;
});
const addContainersToNode = (NodeAddrID, ip, MemTotal) => __awaiter(void 0, void 0, void 0, function* () {
    // fill nodes with containers
    // const batch = ips.map(async ip => {
    const containers = yield get.containers(ip);
    if (!containers)
        return;
    const sortRunningOnTop = (a, b) => {
        if (a.State === b.State)
            return 0;
        if (a.State === 'running')
            return -1;
        else
            return 1;
    };
    let _containers = [];
    containers.sort(sortRunningOnTop).forEach(container => {
        _containers.push(elements.container(container, MemTotal));
    });
    // filter out manually deleted containers (in this case c would be 'DELETED')
    _containers = _containers.filter(c => typeof c !== 'string');
    elements.complete.node(NodeAddrID, ip, _containers);
    return;
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const nodes = yield get.nodes();
    if (!nodes)
        return;
    yield addNodes(nodes);
    // array of all "ready"-node addresses (ip)
    let nodeAddresses = nodes.filter(n => n.State === 'ready').map(n => n.Addr);
    // get agents/dns (ip of the agents inside the visualizer overlay network)
    const ips = yield get.agentsDns();
    if (ips.length === 0)
        return;
    // console.log('nodeAddresses', nodeAddresses)
    // console.log("Agent IP's", ips)
    // (for each node)
    const batch = ips.map((ip) => __awaiter(void 0, void 0, void 0, function* () {
        // get more info about that node
        const info = yield get.info(ip);
        if (!info)
            return;
        // check nodeAddress as fetched
        const index = nodeAddresses.indexOf(info.NodeAddr);
        if (index > -1)
            nodeAddresses.splice(index, 1);
        // update stats of node
        const { node_address, mem_total, operating_system, disk } = info;
        const { cpu_count = 0, cpu_usage = 0, mem_usage = 0 } = info;
        const NodeAddrID = ipToId(node_address);
        const nodeHTML = document.getElementById(NodeAddrID);
        if (nodeHTML) {
            // replace os
            const os = nodeHTML.querySelector('.os');
            if (os)
                os.innerHTML = operating_system;
            // replace usage
            const usage = nodeHTML.querySelector('.usage');
            if (usage)
                usage.innerHTML = `${toGiB(mem_total)}G / ${cpu_count} Cors / ${disk === null || disk === void 0 ? void 0 : disk.total_space}G`;
            // replace usage_percent
            const usage_percent = nodeHTML.querySelector('.usage_percent');
            if (usage_percent)
                usage_percent.innerHTML = `${(100 * mem_usage).toFixed(2)}% / ${cpu_usage.toFixed(2)}% / ${(100 * (disk === null || disk === void 0 ? void 0 : disk.disk_percent)).toFixed(2)}%`;
        }
        // add containers
        yield addContainersToNode(NodeAddrID, ip, mem_total);
        return;
    }));
    yield Promise.all(batch);
    // the remaining nodes that could somehow not be accessed (maybe they are restarting or not yet marked as "down")
    nodeAddresses.forEach(ip => {
        addOrangeCircle(ip);
    });
});
main();
setInterval(() => {
    main();
}, 5000);
