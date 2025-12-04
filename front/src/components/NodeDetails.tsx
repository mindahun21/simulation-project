import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface NodeDetailsProps {
    nodeName: string;
    history: any[];
}

const Chart: React.FC<{ data: any[]; dataKey: string; stroke: string; title: string }> = ({ data, dataKey, stroke, title }) => (
    <div className="chart-container" style={{ marginBottom: '20px' }}>
        <h4>{title}</h4>
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={dataKey} stroke={stroke} activeDot={{ r: 8 }} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const NodeDetails: React.FC<NodeDetailsProps> = ({ nodeName, history }) => {
    if (!history || history.length === 0) {
        return <div>No data available for {nodeName}</div>;
    }

    return (
        <div className="node-details">
            <h3>Metrics for {nodeName}</h3>
            <Chart data={history} dataKey="queue_length" stroke="#8884d8" title="Queue Length" />
            <Chart data={history} dataKey="packets_processed" stroke="#82ca9d" title="Packets Processed" />
            <Chart data={history} dataKey="packet_dropped" stroke="#ffc658" title="Packets Dropped" />
        </div>
    );
};

export default NodeDetails;
