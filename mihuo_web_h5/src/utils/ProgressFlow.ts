import { ProgressConfig, ProgressNode, NodeData, StageConfig, PreNode, TUNNEL_PREFIX } from './entries';
import { Graph, Node, Edge, Cell } from '@antv/x6';
import '@antv/x6-vue-shape'
import projectItem from '@/components/projectTemplateDesignItem/projectItem.vue';

const baseConfig = {
    width: 200,
    height: 160,
    horizontalOffset: 50,
    verticalOffset: 50,
    offsetTop: 100,
    tunnelGap: 15,
    tunnelBackground: '',
    tunnelShape: 'rect',
    nodeShape: 'vue-shape',
    nodeComponent: 'projectItem',
    tunnelComponent: 'projectItem'
}
const ICON_SIZE = 24;
const ADD_ICON_PATH = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIBJREFUOE/lU8ENgCAQu86jQ+hkwmQ6hM5TcwYIQbgQXib2ByVNrz0gBkieSgOYW8/QIkg6EdkC7wHo+YVvC6j9aHtohH6BEFgZEHMH1QABB5K7iCxWnQZ3qIB2PQ0KXE+NxQhqPSKFmN0lHoC39qA/xJp9kr8XCO3ojuh3Xls13zovUJ5ICgs7AAAAAElFTkSuQmCC';
const EDIT_ICON_PATH = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAQRJREFUOE+lki1PQ1EQRM/gcBgwBIdDVaJokSi+Hanjf8C/wKIoHwkIHAkkOBwCDJKkBkXqSJMhS/qapbTvPWDdTXbOzt0d8c/Sb/S2m5LusqY2wPYRsA8cS2oXkFoA26fATpq8JOk53qUA24vAHvAEdAaArqT5Sge2F4AroAEcAjHxBNiVdFYKsD0HXALLyfZBOMnisV+wPQNcAKtJ/BI7kPQ4erVvO7A9DZwDa6nxFdiW9DDu5EOA7amBeCM1vgFbku4n5SUDmsBtauwBm5JuysKWAStAkbI+sC7puiqpo4BwERXbjl1U1hfAdlh/Bz4qFTA7zIDUKgCuIfzRoqi/CLPmE4WhThGYE43NAAAAAElFTkSuQmCC';
const DELETE_ICON_PATH = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIpJREFUOE/tk7sNgDAQQ+0xmIAhaMjkUCB2YALGMAqCKDpyEFFQkdJnvfuGKDxJHYDJhDqSs7UzCpIGE2gAtEZbAKy5RjJ4gFJhFy0BqtyOaa/gaKMHYFvx2IHkGIMlQHioKCbxASTPucSK0jszSlItYDcehCED/4Avh/hujdnqvHu6P6TKf5EucQNiKpMRxuU9eAAAAABJRU5ErkJggg==';

class ProgressFlow {
    private readonly dom: HTMLElement;
    private containerInfo: {
        width: number,
        height: number
    }
    private config: ProgressConfig;
    graph: Graph;
    private progressList: Array<ProgressNode> = [];
    private nodeKeyMapping = new Map<string, NodeData>();
    private sortMapping = new Map<string, number>();
    private stageMapping = new Map<string, StageConfig>();
    private selectedEdge?: Edge;
    private selectedNode?: Node;
    private hoveredNode?: Node;
    private timer?: ReturnType<typeof setTimeout>;
    static Graph = Graph;
    private maxLevel: number = 0;

    constructor(dom: HTMLElement, config?: ProgressConfig) {
        this.dom = dom;
        this.containerInfo = {
            width: this.dom.offsetWidth,
            height: this.dom.offsetHeight,
        };
        this.config = { ...baseConfig, ...config };
        //将组件注册到Graph中
        Graph.registerVueComponent(
            'projectItem',
            {
                template: `
                <projectItem />`,
                components: {
                    projectItem
                }
            },
            true
        )
        this.graph = new Graph({
            container: this.dom,
            width: this.containerInfo.width,
            height: this.containerInfo.height,
            panning: {
                enabled: true,
                eventTypes: ['leftMouseDown', 'mouseWheel']
            },
            grid: true,
            mousewheel: {
                enabled: true,
                zoomAtMousePosition: true,
                modifiers: 'ctrl',
                minScale: 0.5,
                maxScale: 3
            },
            embedding: false,
            autoResize: true,
            interacting: {
                nodeMovable: false,
                vertexDeletable: false,
                vertexMovable: false
            },
            resizing: false,
            rotating: false,
            // scroller: true,
            selecting: {
                enabled: true,
                movable: false,
                className: 'my-selecting',
                // filter:['react-component'],
                // showEdgeSelectionBox: true
            },
            snapline: true,
            keyboard: true,
            clipboard: true,
            allowRubberband: () => false,
            minimap: { enabled: !!this.config.minimap, container: this.config.minimap || undefined },
            connecting: {
                snap: true, allowMulti: true, allowBlank: false, allowLoop: false, allowEdge: false
            }
        });
        this.initialEvents();
        this.registerTools();
    }

    initialEvents() {
        this.graph.on('edge:connected', ({ edge }) => {
            const source: any = edge.source;
            const target: any = edge.target;
            const sourceId = source.cell;
            const targetId = target.cell;
            if (this.checkConnectLegal(sourceId, targetId)) {
                this.config.onConnected && this.config.onConnected(sourceId, targetId);
            } else {
                this.graph.removeCell(edge)
            }
        });
        this.graph.on('edge:selected', (args: { edge: Edge }) => {
            this.selectedEdge = args.edge;
            this.selectedEdge.addTools([{ name: 'button-remove', args: { distance: 20 } }])
        })
        this.graph.on('edge:removed', () => {
            if (this.selectedEdge) {
                const source: any = this.selectedEdge.source;
                const target: any = this.selectedEdge.target;
                this.config.onDeleteEdge && this.config.onDeleteEdge(source?.cell, target?.cell, this.selectedEdge);
            }
            this.selectedEdge = undefined;
        });
        this.graph.on('edge:unselected', () => {
            this.selectedEdge?.removeTools();
            this.selectedEdge = undefined;

        })
        this.graph.on('node:selected', (args: any) => {
            this.selectedNode = args.node;
            const nodeId = args?.node?.id || '';
            if (nodeId.indexOf(TUNNEL_PREFIX) !== 0) {
                this.highlightNode(nodeId);
            } else {
                this.cancelHighlight()
            }
        })
        this.graph.on('node:unselected', (args: { node: Node }) => {
            this.cancelHighlight();
            this.selectedNode = undefined;
        });

        this.graph.on('node:mouseenter', (args: any) => {
            const nodeId = args?.node?.id || '';
            if (nodeId.indexOf(TUNNEL_PREFIX) !== 0) {
                if (args.node.id !== this.hoveredNode) {
                    this.hoveredNode?.removeTools();
                    this.timer && clearTimeout()
                    this.hoveredNode = args.node;
                }
                args.node.addTools([
                    { name: 'btn-add', },
                    { name: 'btn-edit', },
                    { name: 'btn-delete', },
                ])
            }
        })
        this.graph.on('node:mouseleave', (args: any) => {
            const nodeId = args?.node?.id || '';
            if (nodeId.indexOf(TUNNEL_PREFIX) !== 0) {

                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    args.node.removeTools();
                }, 1000)
            } else {
                // this.hoveredNode?.removeTools();
                // this.hoveredNode = undefined;
            }
        })
        this.graph.bindKey(['delete', 'backspace', 'tab'], (args: any) => {
            if (args.key === 'Tab' && this.selectedNode && this.selectedNode.id.indexOf(TUNNEL_PREFIX) !== 0) {
                const nodeData = this.selectedNode.data;
                const position = {
                    x: nodeData.position.x + this.config.width,
                    y: nodeData.position.y + this.config.height
                }
                this.config.onToolsClick && this.config.onToolsClick(nodeData, 'add', position, (nodeId: string) => {
                    // this.graph.select(nodeId);
                    // this.selectedNode = this.graph.getCellById(nodeId)
                });
            }
            if ((args.key === 'Delete' || args.key === 'Backspace') && this.selectedEdge) {
                const source: any = this.selectedEdge.source;
                const target: any = this.selectedEdge.target;
                this.config.onDeleteEdge && this.config.onDeleteEdge(source?.cell, target?.cell, this.selectedEdge);
            }
        });
        this.graph.bindKey('delete', (args: any) => {
            if (args.key === 'Delete' && this.selectedEdge) {
                const source: any = this.selectedEdge.source;
                const target: any = this.selectedEdge.target;
                this.config.onDeleteEdge && this.config.onDeleteEdge(source?.cell, target?.cell, this.selectedEdge);
            }
        })
    }

    generateButtonTool(type: string) {
        let configInfo = {
            x: this.config.width - ICON_SIZE / 2 + 4,
            y: this.config.height,
            iconPath: ADD_ICON_PATH,
            backgroundColor: 'blue'
        }
        switch (type) {
            case 'edit':
                configInfo.x = -ICON_SIZE / 2 + 4;
                configInfo.iconPath = EDIT_ICON_PATH;
                break
            case 'delete':
                configInfo.y = -ICON_SIZE / 2 + 4;
                configInfo.iconPath = DELETE_ICON_PATH;
                configInfo.backgroundColor = 'red';
                break
            case 'add':
            default:

        }
        return {
            inherit: 'button', // 基类名称，使用已经注册的工具名称。
            width: ICON_SIZE,
            height: ICON_SIZE,
            refX: 100,
            x: configInfo.x,
            y: configInfo.y,
            onClick: (event: { cell: Cell, e: any }) => {
                const nodeData = event.cell.data;
                const position = { x: event.e.clientX, y: event.e.clientY }
                this.config.onToolsClick && this.config.onToolsClick(nodeData, type, position, (nodeId: string) => {
                    // this.graph.select(nodeId);
                });
            },
            markup: [
                {
                    tagName: 'circle',
                    selector: 'button',
                    attrs: {
                        r: ICON_SIZE / 2,
                        cx: 8,
                        cy: 8,
                        fill: configInfo.backgroundColor,
                        cursor: 'pointer',
                    },
                },
                {
                    tagName: 'image',
                    selector: `icon`,
                    attrs: {
                        width: 16,
                        height: 16,
                        href: configInfo.iconPath,
                    }
                }
            ],
        };
    }

    registerTools() {
        Graph.unregisterNodeTool('btn-add');
        Graph.registerNodeTool('btn-add', this.generateButtonTool('add'))
        Graph.unregisterNodeTool('btn-edit');
        Graph.registerNodeTool('btn-edit', this.generateButtonTool('edit'))
        Graph.unregisterNodeTool('btn-delete');
        Graph.registerNodeTool('btn-delete', this.generateButtonTool('delete'))
    }

    static getEdgeKey(preNodeId: string, key: string): string {
        return `s:${preNodeId}~t:${key}`
    }

    checkConnectLegal(sourceId: string, targetId: string): boolean {
        const { nodes } = this.getNodeFrontPath(sourceId);
        return nodes.indexOf(targetId) === -1
    }

    cancelHighlight() {
        this.graph.getNodes().forEach(((node: Node) => {
            node.attr({ body: { opacity: 1 }, text: { opacity: 1 } });
        }));
        this.graph.getEdges().forEach(((edge: Edge) => {
            edge.attr({ path: { opacity: 1 }, text: { opacity: 1 }, rect: { opacity: 1 } })
        }));
    }

    getNodeFrontPath(nodeId: string): { edges: Array<string>, nodes: Array<string> } {
        const nodes: Array<string> = [];
        const edges: Array<string> = [];
        const getPreviousNodes = (id: string) => {
            const originalNode = this.nodeKeyMapping.get(id);
            const preNodeIds = [];
            if (originalNode && originalNode.originalData.preNodes) {
                preNodeIds.push(...originalNode.originalData.preNodes.map((preNode: PreNode) => {
                    nodes.push(preNode.nodeId);
                    edges.push(ProgressFlow.getEdgeKey(preNode.nodeId, id))
                    return preNode.nodeId;
                }))
            }
            if (preNodeIds.length > 0) {
                preNodeIds.forEach((i: string) => getPreviousNodes(i))
            }
        }
        getPreviousNodes(nodeId);
        return { nodes, edges };
    }

    getAfterNodesInfo(nodeId: string): { edges: Array<string>, nodes: Array<string> } {
        const nodes: Array<string> = [];
        const edges: Array<string> = [];

        const originalNode = this.nodeKeyMapping.get(nodeId);
        const getAfterNodes = (id: string) => {
            const matchedIds: Array<string> = [];
            this.nodeKeyMapping.forEach((node: NodeData) => {
                if (originalNode && node.level > originalNode.level) {
                    const matchedNode = node.originalData.preNodes.find((preNode: PreNode) => preNode.nodeId === id);
                    if (matchedNode) {
                        const matchedId = node.originalData.id;
                        matchedIds.push(matchedId);
                        nodes.push(matchedId);
                        edges.push(ProgressFlow.getEdgeKey(id, matchedId));
                    }
                }
            });
            if (matchedIds.length > 0) {
                for (const i of matchedIds) {
                    getAfterNodes(i);
                }
            }
        }
        getAfterNodes(nodeId);
        return { nodes, edges };
    }

    highlightNode(nodeId: string) {
        const nodes: Array<string> = [nodeId];
        const edges: Array<string> = [];
        const afterNodeInfo = this.getAfterNodesInfo(nodeId);
        nodes.push(...afterNodeInfo.nodes);
        edges.push(...afterNodeInfo.edges);

        const frontNodeInfo = this.getNodeFrontPath(nodeId);
        nodes.push(...frontNodeInfo.nodes);
        edges.push(...frontNodeInfo.edges);

        this.graph.getNodes().forEach(((node: Node) => {
            if (nodes.indexOf(node.id) === -1 && node.id.indexOf(TUNNEL_PREFIX) !== 0) {
                node.attr({ body: { opacity: 0.2 }, text: { opacity: 0.2 } })
            } else {
                node.attr({ body: { opacity: 1 }, text: { opacity: 1 } })
            }
        }));
        this.graph.getEdges().forEach(((edge: Edge) => {
            if (edges.indexOf(edge.id) === -1) {
                edge.attr({ path: { opacity: 0 }, text: { opacity: 0 }, rect: { opacity: 0 } })
            } else {

                edge.attr({ path: { opacity: 1 }, text: { opacity: 1 }, rect: { opacity: 1 } })
            }
        }));
    }


    handleData(): { edges: Array<Node.Metadata>, nodes: Array<Node.Metadata> } {
        this.stageMapping = new Map();
        this.nodeKeyMapping = new Map();
        // step 1 递归并获取所有数据的level,并对数据进行预处理
        const unresolvedKeys: Array<string> = [];
        this.progressList.forEach((progress: ProgressNode) => {
            const nodeData = { originalData: progress, level: 0, sort: 0, position: { x: 0, y: 0 } };
            if (!this.stageMapping.get(progress.stage)) {
                this.stageMapping.set(progress.stage, { width: 0, offset: 0, levelNodes: new Map() })
            }
            if (progress.preNodes && progress.preNodes.length > 0) {
                nodeData.level = Math.max(...progress.preNodes.map((preNodeInfo: PreNode) => {
                    const preNodeId = preNodeInfo.nodeId;
                    const preNode = this.nodeKeyMapping.get(preNodeId)
                    // 能获取到前置节点的参数，则直接赋值，否则进入待处理列表。
                    if (preNode) {
                        return preNode.level + 1;
                    }
                    unresolvedKeys.push(progress.id);
                    return 0;
                }));
                this.maxLevel = Math.max(nodeData.level, this.maxLevel);
            }

            this.nodeKeyMapping.set(progress.id, nodeData)
        });
        const updateChildrenLevel = (key: string, level: number) => {
            this.nodeKeyMapping.forEach((nodeData: NodeData) => {
                if (nodeData.originalData.preNodes.findIndex((preNode: PreNode) => preNode.nodeId === key) !== -1) {
                    if (nodeData.level < level + 1) {
                        nodeData.level = Math.max(nodeData.level, level + 1);
                        this.maxLevel = Math.max(nodeData.level, this.maxLevel);
                        this.nodeKeyMapping.set(nodeData.originalData.id, nodeData);
                        updateChildrenLevel(nodeData.originalData.id, nodeData.level)
                    }
                }
            })
        }
        // 1.1 处理剩余ID
        const resolveResetNodes = (keys: Array<string>) => {
            for (const key of keys) {
                const currentNode = this.nodeKeyMapping.get(key);
                if (currentNode?.originalData.preNodes && currentNode?.originalData.preNodes.length > 0) {
                    currentNode.level = Math.max(...currentNode?.originalData.preNodes.map((preNodeInfo: PreNode) => {
                        const preNodeId = preNodeInfo.nodeId;
                        const preNode = this.nodeKeyMapping.get(preNodeId)
                        // 能获取到前置节点的参数，则直接赋值，否则进入待处理列表。
                        if (preNode) {
                            return preNode.level + 1;
                        }
                        return -1;
                    }));

                    this.maxLevel = Math.max(currentNode.level, this.maxLevel);
                    updateChildrenLevel(key, currentNode.level)
                }
            }
        }

        resolveResetNodes(unresolvedKeys);
        // step 2 按照stage 进行分组
        this.nodeKeyMapping.forEach((node: NodeData, key: string) => {
            const stage = node.originalData.stage;
            const levelStr = node.level.toString();
            const stageInfo = this.stageMapping.get(stage);
            if (stageInfo) {
                let levelKeys: Array<string>;
                levelKeys = stageInfo?.levelNodes.get(levelStr) || [];
                levelKeys.push(key);
                stageInfo?.levelNodes.set(levelStr, levelKeys);
                this.stageMapping.set(stage, stageInfo);
            }
        });
        // step 3 获取每个stage的宽度及排列位置
        const stageTunnelNode: Array<Node.Metadata> = [];
        const progressNode: Array<Node.Metadata> = [];
        let stageOffset = 0;
        let totalTunnelWidth = 0;
        this.stageMapping.forEach((stageInfo: StageConfig) => {
            stageInfo.offset = stageOffset;
            const levelNodes = stageInfo.levelNodes;
            let stageCount = 0;
            levelNodes.forEach((keys: Array<string>) => {
                stageCount = Math.max(stageCount, keys.length);
            });
            const stageWidth = stageCount * this.config.width + (stageCount + 3) * this.config.horizontalOffset;
            stageInfo.width = stageWidth;
            stageOffset += stageWidth;
            totalTunnelWidth += stageWidth;
        });
        this.stageMapping.forEach((stageInfo: StageConfig, stage: string) => {
            const levelNodes = stageInfo.levelNodes;
            const tunnelNode = {
                shape: this.config.tunnelShape,
                id: TUNNEL_PREFIX + stage,
                label: stage,
                width: stageInfo.width,
                height: Math.max(this.containerInfo.height - 20, (this.maxLevel + 1) * this.config.height + this.maxLevel * this.config.verticalOffset + this.config.offsetTop * 2),
                x: (stageInfo.offset || 0) + (this.containerInfo.width - totalTunnelWidth) / 2,
                y: 0,
                data: { stageInfo, stage, type: 'tunnel' },
                zIndex: 1,
                component: this.config.tunnelComponent,
                attrs: {
                    body: { fill: this.config.tunnelBackground, strokeWidth: 1 },
                    label: { refY: '10', textVerticalAnchor: 'top', }
                }
            };
            stageTunnelNode.push(tunnelNode);
            this.stageMapping.set(stage, stageInfo)
            const center = tunnelNode.x + (tunnelNode.width || 0) / 2;
            // step 4 计算每个节点的位置，并输出最终节点数据
            levelNodes.forEach((levelGroup) => {
                //重新排序
                levelGroup.sort((a: string, b: string): number => {
                    const aNode = this.nodeKeyMapping.get(a);
                    const bNode = this.nodeKeyMapping.get(b);
                    const aSort = aNode ? Math.max(...aNode.originalData.preNodes.map((preNodeInfo: PreNode): number => this.sortMapping.get(preNodeInfo.nodeId) || 0)) : 0;
                    const bSort = bNode ? Math.max(...bNode.originalData.preNodes.map((preNodeInfo: PreNode): number => this.sortMapping.get(preNodeInfo.nodeId) || 0)) : 0;
                    return aSort - bSort;
                })
                levelGroup.forEach((key, index) => {
                    this.sortMapping.set(key, index);
                    let node = this.getNodeFromProgress(this.nodeKeyMapping.get(key), index, levelGroup.length, center);
                    progressNode.push(node);
                });
            });
        });

        let levelMapping: Map<string, number> = new Map();
        // step 5 处理所有连接线
        const edges: Array<Node.Metadata> = [];
        this.nodeKeyMapping.forEach((nodeData: NodeData, key: string) => {
            const progress = nodeData.originalData;
            if (progress.preNodes && progress.preNodes.length > 0) {
                progress.preNodes.forEach((preNodeInfo: PreNode) => {
                    const preNodeId = preNodeInfo.nodeId;
                    const levelStr = nodeData.level.toString();
                    let num = levelMapping.get(levelStr) || 0;
                    num++;
                    levelMapping.set(levelStr, num);
                    edges.push({
                        attrs: {
                            line: {
                                stroke: "#7c68fc",
                                strokeWidth: 1
                            },
                        },
                        zIndex: 101,
                        id: ProgressFlow.getEdgeKey(preNodeId, key),
                        source: preNodeId,
                        target: key,
                        label: {
                            attrs: {
                                text: {
                                    text: preNodeInfo.connectLabel || "cewshi"
                                }
                            },
                            position: {
                                distance: -1 * this.config.offsetTop * 0.45,
                            }
                        },
                        router: {
                            name: 'manhattan',
                            args: {
                                padding: {
                                    left: 0,
                                }
                            }
                        },
                        vertices: [
                            {
                                x: (this.nodeKeyMapping.get(preNodeId)?.position?.x || 0) + this.config.width / 2,
                                y: (this.nodeKeyMapping.get(preNodeId)?.position.y || 0) + this.config.height + 20
                            },
                            {
                                x: (nodeData.position?.x || 0) + this.config.width / 2,
                                y: (nodeData.position?.y || 0) - 10 - (num) * this.config.tunnelGap
                            }
                        ],
                        // vertices: [
                        //     {
                        //         x: 10,
                        //         y: 10
                        //     },
                        //     {
                        //         x: 20,
                        //         y: 20
                        //     }
                        // ],

                        connector: {
                            name: 'rounded',
                            args: {},
                        },
                    })
                })

            }
        });

        return { nodes: [...stageTunnelNode, ...progressNode], edges }
    }

    getNodeFromProgress(node: NodeData | undefined, index: number, total: number, center: number): Node.Metadata {
        if (node) {
            const progress = node.originalData;
            let x;
            //计算x居中
            if (total % 2 === 0) {
                x = center - (total * this.config.width + (total - 1) * this.config.horizontalOffset) / 2 + index * (this.config.width + this.config.horizontalOffset)
            } else {
                x = center - (total * this.config.width + (total - 1) * this.config.horizontalOffset) / 2 + index * (this.config.width + this.config.horizontalOffset) //+ this.config.width / 2
            }

            if (progress.x) {
                x = progress.x;
            }
            const y = progress.y ? progress.y : (node.level) * (this.config.height + this.config.verticalOffset) + this.config.offsetTop;
            node.position.x = x;
            node.position.y = y;
            this.nodeKeyMapping.set(progress.id, node);
            // let shape = ;
            const nodeConfig = {
                id: progress.id,
                label: progress.name,
                width: this.config.width,
                height: this.config.height,
                zIndex: 99,
                x,
                y,
                shape: this.config.nodeShape,
                component: this.config.nodeComponent,
                data: node,
                attrs: {
                    body: { strokeWidth: 1, stroke: '#666', refPoints: '' }
                },
                ports: {
                    groups: {
                        bottom: {
                            position: { name: 'bottom' }, attrs: {
                                circle: {
                                    r: 4,
                                    magnet: true,
                                    stroke: '#2D8CF0',
                                    strokeWidth: 1,
                                    fill: '#fff',
                                },
                            },
                        },
                        left: {
                            position: { name: 'left' }, attrs: {
                                circle: {
                                    r: 4,
                                    magnet: true,
                                    stroke: '#2D8CF0',
                                    strokeWidth: 1,
                                    fill: '#fff',
                                },
                            },
                        },
                        right: {
                            position: { name: 'right' }, attrs: {
                                circle: {
                                    r: 4,
                                    magnet: true,
                                    stroke: '#2D8CF0',
                                    strokeWidth: 1,
                                    fill: '#fff',
                                },
                            },
                        },
                        top: {
                            position: { name: 'top' }, attrs: {
                                circle: {
                                    r: 4,
                                    magnet: true,
                                    stroke: '#2D8CF0',
                                    strokeWidth: 1,
                                    fill: '#fff',
                                },
                            },
                        }
                    },
                    items: [
                        { id: progress.id + 'bottom-port', group: 'bottom' },
                        { id: progress.id + 'top-port', group: 'top' },
                        { id: progress.id + 'left-port', group: 'left' },
                        { id: progress.id + 'right-port', group: 'right' },
                    ]
                }
            }
            if (node.originalData.nodeType === 'condition') {
                nodeConfig.shape = 'polygon';
                // nodeConfig.attrs.body.refPoints = '60,20 100,40 100,80 60,100 20,80 20,40' ;
                nodeConfig.attrs.body.refPoints = `0,50 50,0 100,50 50,100`;
            }
            return nodeConfig;
        }
        return { id: '1', label: 'error' }
    }

    destroyNode(id: string) {
        this.graph.getCellById(id).dispose();
    }

    render(progressList: Array<ProgressNode>) {
        this.progressList = progressList;
        // this.graph.dispose();
        this.graph.fromJSON(this.handleData())
        // const data{edges:Array<Edge> , nodes:Array<Node>} = this.handleData();
        /* const data = this.handleData();
          const edges: Array<Node.Metadata> = data.edges;
          const nodes: Array<Node.Metadata> = data.nodes;

          nodes.forEach((node: Node.Metadata) => {
              if (node.id && !this.graph.hasCell(node.id)) {
                  this.graph.addNode(node);
              }
              if (node.id && this.graph.hasCell(node.id)) {
                  const oldNode = this.graph.getCellById(node.id);
                  const newNode = nodes.find(item=>item.id ===node.id);
                  if(newNode && oldNode){

                      oldNode.transition('position' , newNode);
                      oldNode.setData(newNode.data);
                      if(oldNode.isNode()){
                          oldNode.size(newNode.width || this.config.width,newNode.height|| this.config.width)
                      }
                  }
              }
          });
          edges.forEach((edge:Node.Metadata)=>{
              if (edge.id && !this.graph.hasCell(edge.id)) {
                  this.graph.addEdge(edge);
              }
          })*/
    }
}

export default ProgressFlow;
