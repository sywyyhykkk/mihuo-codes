import {Cell, Edge} from "@antv/x6";

export interface ProgressNode {
    id: string,
    name: string,
    preNodes: Array<PreNode>,
    stage: string,
    x?: number,
    y?: number,
    nodeType?:string
}

export interface PreNode {
    nodeId: string,
    connectLabel: string
}

export interface NodeData {
    originalData: ProgressNode,
    level: number,
    sort: number,
    graphNode?: Cell,
    position: { x: number, y: number }
}

export interface StageConfig {
    width?: number,
    offset?: number,
    centerOffset?: number,
    levelNodes: Map<string, Array<string>>
}

export interface ProgressConfig {
    width: number,
    height: number,
    horizontalOffset: number,
    verticalOffset: number,
    offsetTop: number,
    tunnelGap: number,
    tunnelBackground: string,
    tunnelShape: string,
    nodeShape: string,
    nodeComponent: string,
    tunnelComponent: string,
    minimap?: HTMLElement | null,
    onConnected?: Function,
    onDeleteEdge?: Function,
    onToolsClick?: Function,
}

export const TUNNEL_PREFIX = 'tunnel-prefix'

// export {ProgressNode, ProgressConfig};
