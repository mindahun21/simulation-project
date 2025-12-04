import React, { useState } from 'react';
import ControlsPanel from '../components/ControlsPanel';
import NodeTable from '../components/NodeTable';
import MetricsCharts from '../components/MetricsCharts';
import GlobalMetrics from '../components/GlobalMetrics';
import useSimulationPolling from '../hooks/useSimulationPolling';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const { status, metricsHistory, resetHistory, fetchData } = useSimulationPolling(isSimulationRunning);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Network Simulation Dashboard</h1>
                <span className="subtitle">Real-time network performance monitoring</span>
            </header>
            
            <main className="dashboard-main">
                <ControlsPanel
                    isSimulationRunning={isSimulationRunning}
                    setIsSimulationRunning={setIsSimulationRunning}
                    fetchData={() => { fetchData(); }}
                    resetHistory={resetHistory}
                />
                
                <div className="content-grid">
                    <section className="metrics-section">
                        <GlobalMetrics metricsHistory={metricsHistory} />
                    </section>
                    
                    <section className="charts-section">
                        <MetricsCharts metricsHistory={metricsHistory} />
                    </section>
                    
                    <section className="table-section">
                        <NodeTable nodeStatus={status?.nodes || []} />
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
