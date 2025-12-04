const API_BASE_URL = 'http://localhost:8000'; // Assuming backend runs on port 8000

interface StartSimulationParams {
    num_nodes: number;
    topology_type: string;
    packet_rate: number;
    traffic_pattern: string;
    duration: number;
    realtime: boolean;
    processing_delay: number;
}

export const startSimulation = async (params: StartSimulationParams) => {
    const response = await fetch(`${API_BASE_URL}/start_simulation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    return response.json();
};

export const pauseSimulation = async () => {
    const response = await fetch(`${API_BASE_URL}/pause_simulation`, {
        method: 'POST',
    });
    return response.json();
};

export const resumeSimulation = async () => {
    const response = await fetch(`${API_BASE_URL}/resume_simulation`, {
        method: 'POST',
    });
    return response.json();
};

export const stopSimulation = async () => {
    const response = await fetch(`${API_BASE_URL}/stop_simulation`, {
        method: 'POST',
    });
    return response.json();
};

export const resetSimulation = async () => {
    const response = await fetch(`${API_BASE_URL}/reset_simulation`, {
        method: 'POST',
    });
    return response.json();
};

export const configureNetwork = async (params: any) => {
    const response = await fetch(`${API_BASE_URL}/configure_network`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    return response.json();
};

export const getStatus = async () => {
    const response = await fetch(`${API_BASE_URL}/get_status`);
    return response.json();
};

export const getMetrics = async () => {
    const response = await fetch(`${API_BASE_URL}/get_metrics`);
    return response.json();
};

export const getTopology = async () => {
    const response = await fetch(`${API_BASE_URL}/get_topology`);
    return response.json();
};
