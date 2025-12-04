import React, { useState } from 'react';
import { startSimulation, pauseSimulation, resumeSimulation, stopSimulation, resetSimulation } from '../services/api';
import './ControlsPanel.css';

interface ControlsPanelProps {
    isSimulationRunning: boolean;
    setIsSimulationRunning: (isRunning: boolean) => void;
    fetchData: () => void;
    resetHistory: () => void;
}

const MAX_NODES = 20;
const MIN_NODES = 2;

const ControlsPanel: React.FC<ControlsPanelProps> = ({ isSimulationRunning, setIsSimulationRunning, fetchData, resetHistory }) => {
    const [numNodes, setNumNodes] = useState(5);
    const [topologyType, setTopologyType] = useState("ring");
    const [packetRate, setPacketRate] = useState(10);
    const [trafficPattern, setTrafficPattern] = useState("constant");
    const [duration, setDuration] = useState(30);

    const handleNodeChange = (value: number) => {
        const clampedValue = Math.max(MIN_NODES, Math.min(MAX_NODES, value));
        setNumNodes(clampedValue);
    };

    const handleStart = async () => {
        resetHistory();
        
        const params = {
            num_nodes: numNodes,
            topology_type: topologyType,
            packet_rate: packetRate,
            traffic_pattern: trafficPattern,
            duration: duration * 1000, // Convert seconds to ms for backend
            realtime: true
        };
        await startSimulation(params);
        setIsSimulationRunning(true);
        fetchData();
    };

    const handlePause = async () => {
        await pauseSimulation();
        setIsSimulationRunning(false);
    };

    const handleResume = async () => {
        await resumeSimulation();
        setIsSimulationRunning(true);
    };

    const handleStop = async () => {
        await stopSimulation();
        setIsSimulationRunning(false);
    };

    const handleReset = async () => {
        await resetSimulation();
        setIsSimulationRunning(false);
        resetHistory();
    };

    return (
        <div className="controls-panel">
            <div className="panel-header">
                <h2>Simulation Controls</h2>
                <div className={`status-indicator ${isSimulationRunning ? 'running' : 'stopped'}`}>
                    <span className="status-dot"></span>
                    {isSimulationRunning ? 'Running' : 'Stopped'}
                </div>
            </div>
            
            <div className="controls-grid">
                <div className="input-group">
                    <label>
                        Number of Nodes
                        <span className="limit-hint">(Max: {MAX_NODES})</span>
                    </label>
                    <input 
                        type="number" 
                        value={numNodes} 
                        onChange={(e) => handleNodeChange(parseInt(e.target.value) || MIN_NODES)} 
                        min={MIN_NODES}
                        max={MAX_NODES}
                        disabled={isSimulationRunning} 
                    />
                </div>
                
                <div className="input-group">
                    <label>Topology Type</label>
                    <select value={topologyType} onChange={(e) => setTopologyType(e.target.value)} disabled={isSimulationRunning}>
                        <option value="ring">Ring</option>
                        <option value="mesh">Mesh</option>
                        <option value="star">Star</option>
                        <option value="line">Line</option>
                    </select>
                </div>
                
                <div className="input-group">
                    <label>Packet Rate (pkt/s)</label>
                    <input 
                        type="number" 
                        value={packetRate} 
                        onChange={(e) => setPacketRate(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} 
                        min={1}
                        max={100}
                        disabled={isSimulationRunning} 
                    />
                </div>
                
                <div className="input-group">
                    <label>Traffic Pattern</label>
                    <select value={trafficPattern} onChange={(e) => setTrafficPattern(e.target.value)} disabled={isSimulationRunning}>
                        <option value="constant">Constant</option>
                        <option value="poisson">Poisson</option>
                        <option value="bursty">Bursty</option>
                    </select>
                </div>
                
                <div className="input-group">
                    <label>Duration (seconds)</label>
                    <input 
                        type="number" 
                        value={duration} 
                        onChange={(e) => setDuration(Math.max(1, Math.min(300, parseInt(e.target.value) || 1)))} 
                        min={1}
                        max={300}
                        disabled={isSimulationRunning} 
                    />
                </div>
            </div>
            
            <div className="buttons">
                <button className="btn-start" onClick={handleStart} disabled={isSimulationRunning}>
                    Start
                </button>
                <button className="btn-pause" onClick={handlePause} disabled={!isSimulationRunning}>
                    Pause
                </button>
                <button className="btn-resume" onClick={handleResume} disabled={isSimulationRunning}>
                    Resume
                </button>
                <button className="btn-stop" onClick={handleStop} disabled={!isSimulationRunning}>
                    Stop
                </button>
                <button className="btn-reset" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default ControlsPanel;
