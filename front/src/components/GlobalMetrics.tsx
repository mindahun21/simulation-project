import React from 'react';
import './GlobalMetrics.css';

interface GlobalMetricsProps {
    metricsHistory: any[];
}

const GlobalMetrics: React.FC<GlobalMetricsProps> = ({ metricsHistory }) => {
    const latest = metricsHistory.length > 0 ? metricsHistory[metricsHistory.length - 1] : null;
    
    const avgLatency = latest?.latency || 0;
    const throughput = latest?.throughput || 0;
    // packet_loss is already a rate (0-1) from backend, convert to percentage
    const packetLossRate = latest?.packet_loss || 0;
    const packetLossPercent = (packetLossRate * 100).toFixed(2);

    const getPacketLossColor = (rate: number) => {
        if (rate < 0.01) return '#4ade80'; // green - good
        if (rate < 0.05) return '#facc15'; // yellow - warning
        return '#f87171'; // red - critical
    };

    return (
        <div className="global-metrics">
            <h2>Real-Time Metrics</h2>
            <div className="metrics-grid">
                <div className="metric-card latency">
                    <div className="metric-content">
                        <span className="metric-label">Average Latency</span>
                        <span className="metric-value">{(avgLatency * 1000).toFixed(2)}<span className="metric-unit">ms</span></span>
                    </div>
                    <div className="metric-bar">
                        <div 
                            className="metric-bar-fill latency-bar" 
                            style={{ width: `${Math.min(avgLatency * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="metric-card throughput">
                    <div className="metric-content">
                        <span className="metric-label">Throughput</span>
                        <span className="metric-value">{throughput.toFixed(2)}<span className="metric-unit">pkt/s</span></span>
                    </div>
                    <div className="metric-bar">
                        <div 
                            className="metric-bar-fill throughput-bar" 
                            style={{ width: `${Math.min(throughput / 10, 100)}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="metric-card packet-loss">
                    <div className="metric-content">
                        <span className="metric-label">Packet Loss</span>
                        <span className="metric-value" style={{ color: getPacketLossColor(packetLossRate) }}>
                            {packetLossPercent}<span className="metric-unit">%</span>
                        </span>
                    </div>
                    <div className="metric-bar">
                        <div 
                            className="metric-bar-fill packet-loss-bar" 
                            style={{ 
                                width: `${Math.min(packetLossRate * 100, 100)}%`,
                                backgroundColor: getPacketLossColor(packetLossRate)
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalMetrics;
