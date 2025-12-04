from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict
from simulation import Simulation
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sim = Simulation()

class StartSimulationRequest(BaseModel):
    num_nodes: int = 5
    topology_type: str = "ring" # ring, mesh, star, line
    packet_rate: int = 10
    traffic_pattern: str = "constant" # constant, poisson, bursty
    queue_size: int = 50
    link_bandwidth: int = 100
    duration: int = 10000
    realtime: bool = True
    processing_delay: float = 0.1

class ConfigureNetworkRequest(BaseModel):
    nodes: List[Dict]
    links: List[Dict]
    queue_size: int = 50


@app.post("/start_simulation")
def start_simulation(req: StartSimulationRequest, background_tasks: BackgroundTasks):
    # Configure topology
    sim.create_topology(
        type=req.topology_type,
        num_nodes=req.num_nodes,
        queue_size=req.queue_size,
        link_bandwidth=req.link_bandwidth
    )
    
    traffic_config = {
        "packet_rate": req.packet_rate,
        "pattern": req.traffic_pattern
    }
    
    # Start simulation in background
    # duration is in ms, convert to seconds for simulation time
    background_tasks.add_task(sim.start_simulation, traffic_config, req.duration / 1000.0, req.realtime, req.processing_delay)
    return {"status": "Simulation started"}

@app.post("/pause_simulation")
def pause_simulation():
    sim.pause_simulation()
    return {"status": "Simulation paused"}

@app.post("/resume_simulation")
def resume_simulation():
    sim.resume_simulation()
    return {"status": "Simulation resumed"}

@app.post("/stop_simulation")
def stop_simulation():
    sim.stop_simulation()
    return {"status": "Simulation stopped", "metrics": sim.get_metrics()}

@app.get("/get_status")
def get_status():
    return sim.get_status()

@app.get("/get_metrics")
def get_metrics():
    return sim.get_metrics()

@app.get("/get_topology")
def get_topology():
    return sim.get_topology()

@app.post("/configure_network")
def configure_network(req: ConfigureNetworkRequest):
    sim.configure_network(req.nodes, req.links, req.queue_size)
    return {"status": "Network configured"}

@app.post("/reset_simulation")
def reset_simulation():
    sim.reset_simulation()
    return {"status": "Simulation reset"}
