import { useState, useEffect, useRef, useCallback } from 'react';
import { getStatus, getMetrics } from '../services/api';

const useSimulationPolling = (isSimulationRunning: boolean, interval: number = 2000) => {
    const [status, setStatus] = useState<any>(null);
    const [metricsHistory, setMetricsHistory] = useState<any[]>([]);
    const [nodeHistory, setNodeHistory] = useState<Record<string, any[]>>({});
    const intervalRef = useRef<number | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const currentStatus = await getStatus();
            const currentMetrics = await getMetrics();
            
            // Add a timestamp for the x-axis of the chart
            const timestamp = new Date().toLocaleTimeString();
            setMetricsHistory(prevHistory => [...prevHistory, { ...currentMetrics, time: timestamp }]);
            setStatus(currentStatus);

            // Update node history
            if (currentStatus?.nodes) {
                setNodeHistory(prev => {
                    const newHistory = { ...prev };
                    currentStatus.nodes.forEach((node: any) => {
                        if (!newHistory[node.name]) {
                            newHistory[node.name] = [];
                        }
                        newHistory[node.name] = [...newHistory[node.name], { ...node, time: timestamp }];
                    });
                    return newHistory;
                });
            }

            console.log("Fetched Data:", { status: currentStatus, metrics: currentMetrics });

        } catch (error) {
            console.error("Error fetching simulation data:", error);
        }
    }, []);

    // Function to reset the history
    const resetHistory = () => {
        setMetricsHistory([]);
        setNodeHistory({});
        setStatus(null);
    };

    useEffect(() => {
        if (isSimulationRunning) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(fetchData, interval);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isSimulationRunning, interval, fetchData]);

    return { status, metricsHistory, nodeHistory, resetHistory, fetchData };
};

export default useSimulationPolling;
