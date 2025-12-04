import React, { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    type Edge,
    type Node,
    BackgroundVariant,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PacketEdge from './PacketEdge';

interface NetworkEditorProps {
    initialNodes?: Node[];
    initialEdges?: Edge[];
    onTopologyChange: (nodes: any[], links: any[]) => void;
    onSelectionChange?: (selectedNodeId: string | null) => void;
    readOnly?: boolean;
    edgeActivity?: Record<string, number>;
}

const edgeTypes = {
  packet: PacketEdge,
};

const NetworkEditor: React.FC<NetworkEditorProps> = ({ initialNodes = [], initialEdges = [], onTopologyChange, onSelectionChange, readOnly = false, edgeActivity = {} }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        setEdges((eds) =>
            eds.map((edge) => {
                const activity = edgeActivity[edge.id] || 0;
                return {
                    ...edge,
                    type: 'packet', // Force all edges to be packet edges
                    data: { ...edge.data, activity },
                    animated: false, // We use custom animation
                };
            })
        );
    }, [edgeActivity, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'packet' }, eds)),
        [setEdges],
    );

    // Handle selection
    const onSelectionChangeHandler = useCallback(({ nodes }: { nodes: Node[] }) => {
        if (onSelectionChange) {
            onSelectionChange(nodes.length > 0 ? nodes[0].id : null);
        }
    }, [onSelectionChange]);

    const addNode = () => {
        const id = `Node${nodes.length + 1}`;
        const newNode: Node = {
            id,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: id, queue_size: 50 },
            type: 'default', // or custom type
        };
        setNodes((nds) => nds.concat(newNode));
    };

    // Sync changes to parent
    useEffect(() => {
        const topologyNodes = nodes.map(n => ({
            name: n.id,
            queue_size: n.data.queue_size || 50
        }));
        const topologyLinks = edges.map(e => ({
            source: e.source,
            destination: e.target,
            bandwidth: 100, // Default, needs UI to edit
            latency: 0.01
        }));
        onTopologyChange(topologyNodes, topologyLinks);
    }, [nodes, edges, onTopologyChange]);

    return (
        <div style={{ width: '100%', height: '500px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={readOnly ? undefined : onConnect}
                onSelectionChange={onSelectionChangeHandler}
                edgeTypes={edgeTypes}
                fitView
                nodesDraggable={!readOnly}
                nodesConnectable={!readOnly}
                elementsSelectable={!readOnly}
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                {!readOnly && (
                    <Panel position="top-right">
                        <button onClick={addNode} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                            Add Node
                        </button>
                    </Panel>
                )}
            </ReactFlow>
        </div>
    );
};

export default NetworkEditor;
