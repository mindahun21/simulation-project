Backend Specification – Network Traffic Simulation
Project Title:

Network Traffic Simulation and Modeling with FastAPI Backend

Backend Description:

The backend is the simulation engine of the project. It models a virtual network consisting of nodes (clients, routers, servers) connected via links. It generates packets, processes events in discrete time (Discrete-Event Simulation), and calculates key network metrics such as latency, throughput, queue length, and packet loss.

The backend exposes REST API endpoints that allow the frontend to:

Configure the network and simulation parameters.

Control the simulation (start, pause, resume, stop, reset).

Retrieve simulation data and performance metrics in real-time.

Purpose:

Simulate network traffic and performance under configurable conditions.

Provide numerical data for frontend visualization and analysis.

Enable experiment scenarios without using a real network.

Allow users to modify parameters such as network topology, packet generation rate, queue sizes, and link bandwidth.

1. Core Responsibilities
   A. Network Setup

Create nodes (clients, routers, servers) with processing capacity and queues.

Create links connecting nodes with specified bandwidth, latency, and direction.

Store network topology in memory using a graph structure.

B. Packet Generation

Generate packets with attributes: source, destination, timestamp, and optional size.

Support configurable traffic patterns (e.g., Poisson or exponential distributions).

C. Event Processing

Maintain a priority queue of simulation events sorted by simulation time.

Process events: packet arrival, forwarding, delivery, and drop.

Update node and link states after each event.

D. Metrics Calculation

Latency: time taken from packet generation to delivery.

Throughput: number of packets processed per unit time.

Packet Loss: number of dropped packets divided by total packets sent.

Queue Occupancy: current queue length at each node.

E. Simulation Control

Start: Initialize clock, event queue, and metrics; begin processing events.

Pause/Resume: Temporarily suspend or continue event processing.

Stop: Terminate simulation and finalize metrics.

Reset: Clear all simulation state, event queues, and metrics.

F. Data Management

Store simulation data in memory for retrieval by frontend via REST endpoints.

2. API Endpoints – Description & Prompts
   Endpoint Method Input (Prompt) Output Functionality
   /start_simulation POST { "nodes": 5, "packet_rate": 10, "queue_size": 50, "link_bandwidth": 100, "duration": 1000 } { "status": "Simulation started" } Starts the simulation with specified parameters, initializes network, events, and metrics.
   /pause_simulation POST None { "status": "Simulation paused" } Pauses the simulation.
   /resume_simulation POST None { "status": "Simulation resumed" } Resumes a paused simulation.
   /stop_simulation POST None { "status": "Simulation stopped", "metrics": {...} } Stops simulation and returns final metrics.
   /get_status GET None { "nodes": [{"name": "Node1","queue_length":5,"packets_processed":20,"packet_dropped":2}, ...] } Returns current simulation state (real-time numeric data).
   /get_metrics GET None { "latency": 10.5, "throughput": 50, "packet_loss": 0.05 } Returns overall network metrics after simulation.
   /configure_network POST { "nodes": [{"name":"Node1"},...], "links":[{"src":"Node1","dest":"Node2","bandwidth":100,"latency":10}], "queue_size":50 } { "status": "Network configured" } Sets up network topology before starting the simulation.
   /send_packet (optional) POST { "src": "Node1", "dest": "Node3", "size": 100 } { "status": "Packet injected" } Manually inject a packet into the simulation.
   /reset_simulation POST None { "status": "Simulation reset" } Clears all network state, events, and metrics.
3. Backend Functionalities in Detail
   A. Network Initialization

Creates Node objects with queues and processing capabilities.

Creates Link objects with bandwidth, latency, and direction.

Stores the network topology in memory using a graph structure.

B. Packet Generation

Generates packets according to user-specified parameters.

Supports random or bursty traffic patterns.

C. Event Queue Management

Maintains a priority queue of events sorted by simulation time.

Event types: Packet Arrival, Packet Forward, Packet Drop, Packet Delivered.

D. Simulation Engine

Processes events sequentially:

Checks queues and buffer availability.

Forwards packets to next node.

Updates metrics for nodes and links.

Sends periodic numeric updates to the frontend via REST.

E. Metrics Calculation

Latency: delivery time minus generation time.

Throughput: packets processed per unit time.

Packet Loss: packets dropped divided by total packets sent.

Queue Occupancy: current queue length at each node.

F. Simulation Control

Start: initialize clock, event queue, and metrics; begin event processing.

Pause/Resume: temporarily suspend or continue simulation.

Stop: terminate simulation and finalize metrics.

Reset: clear all simulation state and metrics.

4. Optional Features

Save/load network configurations.

Dynamic changes to network during simulation (bandwidth, queue size).

Advanced traffic patterns (priority packets, variable packet sizes).

This version is specific, unambiguous, and ready to hand to an AI coder for implementation using FastAPI with REST APIs only.

Frontend Specification – Network Traffic Simulation
Project Title:

Network Traffic Simulation and Modeling – React Frontend Dashboard

Frontend Description:

The frontend is a React-based dashboard that allows the user to configure, control, and visualize a network traffic simulation running on the FastAPI backend.

The frontend communicates only through REST API requests (no WebSockets). It displays real-time simulation data by periodically polling backend endpoints such as /get_status and /get_metrics.

The dashboard provides input controls for simulation settings, a node statistics table, and visual charts displaying metrics such as latency, throughput, and packet loss.

Purpose

Provide an easy-to-use user interface for interacting with the simulation backend.

Allow users to configure network parameters and initiate simulations.

Display simulation progress and metrics in real-time.

Visualize important network performance measurements using tables and charts.

Help students analyze how simulation parameters affect network behavior.

1. Core Responsibilities
   A. Configuration Input

The frontend must allow users to configure all simulation parameters before starting the simulation:

Number of nodes

Packet generation rate

Queue size per node

Link bandwidth

Simulation duration

Optional: Custom topology (node names and link definitions)

All configurations are sent to the backend via:

/configure_network

or directly through /start_simulation

B. Simulation Control

The frontend must provide buttons to:

Start Simulation → calls /start_simulation

Pause Simulation → calls /pause_simulation

Resume Simulation → calls /resume_simulation

Stop Simulation → calls /stop_simulation

Reset Simulation → calls /reset_simulation

Each button sends a REST request and updates the UI accordingly.

C. Data Polling (REST Only)

The frontend should periodically (e.g., every 1–2 seconds) call:

/get_status → to update node states

/get_metrics → to update performance metrics

No WebSockets are used.

D. Visualization

The frontend must display:

Node Statistics Table

Charts for key network metrics

Optional: textual log of recent simulation events

2. Frontend Components and Functionality
   A. Controls Panel (Top Section)
   Fields:

Number of Nodes (input number)

Packet Rate (input number)

Queue Size (input number)

Link Bandwidth (input number)

Simulation Duration in milliseconds (input number)

Buttons:

Start Simulation

Pause

Resume

Stop

Reset

Functionality:

Each button triggers a POST request to corresponding backend endpoint.

After starting, input fields should be disabled until simulation stops or resets.

B. Node Statistics Table (Middle Section)

A live table showing the current state of each node, updated from /get_status.

Columns:
Column Meaning
Node Name Name/ID of the node
Queue Length Number of packets currently waiting
Packets Processed Total count processed by this node
Packets Dropped Total dropped due to queue overflow
Avg Latency (ms) Average latency for packets passing through this node
Behavior:

Automatically refreshes using periodic backend polling.

At least once every 1–2 seconds.

Render rows dynamically based on backend data.

C. Charts Section (Bottom Section)

Minimum required charts:

1. Latency Chart

Line chart showing average latency over time.

Data from /get_metrics.

2. Throughput Chart

Line or bar chart showing packets processed per second.

3. Packet Loss Chart

Line or bar showing packet loss percentage over time.

Requirements:

Update charts using new metrics returned during polling.

Tools recommended:

Recharts, Chart.js, or Nivo.

D. Optional Visualization (Not Required, but Recommended)
Network Topology Diagram

(If you want it)

Nodes shown as icons.

Links drawn as lines.

Simple static graph, not animated.

Recommended libraries:

React Flow

or vis-network

3. API Calls Required by the Frontend
   POST /start_simulation

Send JSON:

{
"nodes": 5,
"packet_rate": 10,
"queue_size": 50,
"link_bandwidth": 100,
"duration": 1000
}

POST /pause_simulation
POST /resume_simulation
POST /stop_simulation
POST /reset_simulation
POST /configure_network

(Only if the user uses custom topology)

GET /get_status

Used to fill the table.

GET /get_metrics

Used to update charts.

Polling interval: 1 to 2 seconds

4. Frontend Behavior Summary
   Before Simulation

All input fields enabled.

Start button active; Pause/Resume/Stop disabled.

During Simulation

Inputs disabled.

Pause/Stop active; Start/Resume disabled.

Table and charts update using polling.

Paused

Resume + Stop active.

Inputs still disabled.

Stopped

Final metrics displayed.

Allow user to Reset.

Reset

Clear table.

Clear charts.

Re-enable all inputs.

5. Folder Structure (Recommended)
   src/
   ├── components/
   │ ├── ControlsPanel.jsx
   │ ├── NodeTable.jsx
   │ ├── MetricsCharts.jsx
   │ ├── TopologyDiagram.jsx (optional)
   ├── services/
   │ ├── api.js (handles all REST requests)
   ├── hooks/
   │ ├── useSimulationPolling.js
   ├── pages/
   │ ├── Dashboard.jsx
   ├── App.js
   └── index.js

6. Optional Features

You may choose to add:

Export metrics as CSV.

History of simulation runs.

Dark/light mode.

This frontend specification is clean, precise, unambiguous, and ready for an AI coder to implement using React.
