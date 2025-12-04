import React from 'react';
import './NodeTable.css';

interface NodeTableProps {
    nodeStatus: any[];
}

const NodeTable: React.FC<NodeTableProps> = ({ nodeStatus }) => {
    if (nodeStatus.length === 0) {
        return (
            <div className="node-table">
                <h2>Node Statistics</h2>
                <div className="empty-state">
                    <p>No nodes to display. Start a simulation to see node statistics.</p>
                </div>
            </div>
        );
    }

    const totalProcessed = nodeStatus.reduce((sum, node) => sum + (node.packets_processed || 0), 0);
    const totalDropped = nodeStatus.reduce((sum, node) => sum + (node.packet_dropped || 0), 0);

    return (
        <div className="node-table">
            <h2>
                Node Statistics
                <span className="node-count">{nodeStatus.length} nodes</span>
            </h2>
            
            <div className="summary-row">
                <div className="summary-item">
                    <span className="summary-label">Total Processed</span>
                    <span className="summary-value processed">{totalProcessed}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Total Dropped</span>
                    <span className="summary-value dropped">{totalDropped}</span>
                </div>
            </div>
            
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Node</th>
                            <th>Queue</th>
                            <th>Processed</th>
                            <th>Dropped</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nodeStatus.map((node, index) => {
                            const dropRate = node.packets_processed > 0 
                                ? (node.packet_dropped / (node.packets_processed + node.packet_dropped)) 
                                : 0;
                            const status = dropRate > 0.1 ? 'critical' : dropRate > 0.01 ? 'warning' : 'healthy';
                            
                            return (
                                <tr key={index} className={status}>
                                    <td>
                                        <span className="node-name">{node.name}</span>
                                    </td>
                                    <td>
                                        <div className="queue-indicator">
                                            <span className="queue-value">{node.queue_length}</span>
                                            <div className="queue-bar">
                                                <div 
                                                    className="queue-bar-fill" 
                                                    style={{ width: `${Math.min((node.queue_length / 50) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="processed-cell">{node.packets_processed}</td>
                                    <td className="dropped-cell">{node.packet_dropped}</td>
                                    <td>
                                        <span className={`status-badge ${status}`}>
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NodeTable;
