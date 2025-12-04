import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './MetricsCharts.css';

interface MetricsChartsProps {
    metricsHistory: any[];
}

const MetricsCharts: React.FC<MetricsChartsProps> = ({ metricsHistory }) => {
    // Transform data for better display
    const chartData = metricsHistory.map((item, index) => ({
        time: index + 1,
        latency: (item.latency * 1000).toFixed(2), // Convert to ms
        throughput: item.throughput?.toFixed(2) || 0,
        packetLoss: ((item.packet_loss || 0) * 100).toFixed(2) // Convert to percentage
    }));

    return (
        <div className="metrics-charts">
            <h2>Performance Trends</h2>
            <div className="charts-grid">
                <div className="chart-card latency-chart">
                    <h3>Latency (ms)</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                            <Tooltip 
                                contentStyle={{ 
                                    background: 'rgba(30, 30, 47, 0.95)', 
                                    border: '1px solid #60a5fa',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }} 
                            />
                            <Area type="monotone" dataKey="latency" stroke="#60a5fa" strokeWidth={2} fill="url(#latencyGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="chart-card throughput-chart">
                    <h3>Throughput (pkt/s)</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                            <Tooltip 
                                contentStyle={{ 
                                    background: 'rgba(30, 30, 47, 0.95)', 
                                    border: '1px solid #34d399',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }} 
                            />
                            <Area type="monotone" dataKey="throughput" stroke="#34d399" strokeWidth={2} fill="url(#throughputGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="chart-card packet-loss-chart">
                    <h3>Packet Loss (%)</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="packetLossGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                            <Tooltip 
                                contentStyle={{ 
                                    background: 'rgba(30, 30, 47, 0.95)', 
                                    border: '1px solid #f87171',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }} 
                            />
                            <Area type="monotone" dataKey="packetLoss" stroke="#f87171" strokeWidth={2} fill="url(#packetLossGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default MetricsCharts;
