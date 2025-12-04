import React, { useMemo } from 'react';

interface Node {
    name: string;
    queue_length?: number;
    packets_processed?: number;
    packet_dropped?: number;
}

interface Link {
    source: string;
    destination: string;
}

interface NetworkGraphProps {
    nodes: Node[];
    links: Link[];
    width?: number;
    height?: number;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, links, width = 600, height = 400 }) => {
    const radius = Math.min(width, height) / 3;
    const centerX = width / 2;
    const centerY = height / 2;

    const nodePositions = useMemo(() => {
        return nodes.reduce((acc, node, index) => {
            const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2;
            acc[node.name] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            };
            return acc;
        }, {} as Record<string, { x: number; y: number }>);
    }, [nodes, radius, centerX, centerY]);

    return (
        <div className="network-graph">
            <h3>Network Topology</h3>
            <svg width={width} height={height} style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="28"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
                    </marker>
                </defs>
                {links.map((link, i) => {
                    const start = nodePositions[link.source];
                    const end = nodePositions[link.destination];
                    if (!start || !end) return null;

                    return (
                        <line
                            key={i}
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                            stroke="#999"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                        />
                    );
                })}
                {nodes.map((node) => {
                    const pos = nodePositions[node.name];
                    if (!pos) return null;
                    
                    // Simple color coding based on queue length
                    const queueColor = node.queue_length && node.queue_length > 20 ? "#ffcccc" : "#e6f7ff";
                    const strokeColor = node.queue_length && node.queue_length > 40 ? "red" : "#1890ff";

                    return (
                        <g key={node.name}>
                            <circle
                                cx={pos.x}
                                cy={pos.y}
                                r={20}
                                fill={queueColor}
                                stroke={strokeColor}
                                strokeWidth="2"
                            />
                            <text
                                x={pos.x}
                                y={pos.y}
                                dy=".3em"
                                textAnchor="middle"
                                style={{ fontSize: '12px', fontWeight: 'bold' }}
                            >
                                {node.name}
                            </text>
                             {node.queue_length !== undefined && (
                                <text
                                    x={pos.x}
                                    y={pos.y + 35}
                                    textAnchor="middle"
                                    style={{ fontSize: '10px', fill: '#666' }}
                                >
                                    Q: {node.queue_length}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default NetworkGraph;
