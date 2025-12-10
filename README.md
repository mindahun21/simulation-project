# Network Simulation Project

This project is a web-based network simulation tool that allows users to create, visualize, and analyze the performance of different network topologies. It provides a real-time dashboard to monitor key network metrics such as latency, throughput, and packet loss.

## How it Works

The project is divided into two main components: a front-end and a back-end.

### Front-end

The front-end is a React application built with TypeScript and Vite. It provides a user-friendly interface for interacting with the simulation. The main features of the front-end are:

- **Dashboard:** A real-time dashboard that displays the status of the network, including global metrics, historical data charts, and a table of node-specific information.
- **Controls:** A control panel that allows users to start, pause, resume, and stop the simulation.
- **Network Editor:** (Future implementation) A tool for creating and modifying network topologies.

The front-end communicates with the back-end using a REST API. It polls the back-end periodically to get the latest status and metrics of the simulation.

### Back-end

The back-end is a Python application built with the FastAPI framework. It is responsible for running the network simulation and exposing the API for the front-end. The main features of the back-end are:

- **Simulation Engine:** A discrete-event simulation engine that models the behavior of a network. It supports different network topologies, traffic patterns, and queuing disciplines.
- **API Server:** A FastAPI server that provides endpoints for controlling the simulation and retrieving data.

## The Science Behind the Simulation

The simulation is based on the principles of discrete-event simulation. The simulation clock advances from one event to the next. The main types of events in the simulation are:

- **Packet Generation:** A new packet is created at a source node.
- **Packet Arrival:** A packet arrives at a node.
- **Packet Processing:** A node processes a packet from its queue.
- **Simulation End:** The simulation ends.

The simulation uses a priority queue to store the events, ordered by their timestamp. The simulation engine processes the events in chronological order.

The routing of packets is determined by Dijkstra's algorithm, which calculates the shortest path between any two nodes in the network. The weight of the links can be configured to take into account factors such as latency and bandwidth.

## Technical Implementation

### Front-end

- **Framework:** React with TypeScript and Vite
- **Styling:** CSS
- **API Client:** `fetch` API
- **Charting:** Recharts

### Back-end

- **Framework:** FastAPI
- **Simulation Library:** The simulation engine is custom-built using Python's `heapq` module for the event queue.
- **Dependencies:** `fastapi`, `uvicorn`

## How to Run

### Prerequisites

- Node.js and npm (for the front-end)
- Python 3.7+ and pip (for the back-end)

### Back-end Setup

1.  **Navigate to the `back` directory:**

    ```bash
    cd back
    ```

2.  **Create a virtual environment:**

    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment:**

    - On Windows:
      ```bash
      venv\Scripts\activate
      ```
    - On macOS and Linux:
      ```bash
      source venv/bin/activate
      ```

4.  **Install the dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the back-end server:**
    ```bash
    uvicorn main:app --reload
    ```
    The back-end server will be running at `http://localhost:8000`.

### Front-end Setup

1.  **Navigate to the `front` directory:**

    ```bash
    cd front
    ```

2.  **Install the dependencies:**

    ```bash
    npm install
    ```

3.  **Run the front-end development server:**
    ```bash
    npm run dev
    ```
    The front-end application will be running at `http://localhost:5173`.

### Accessing the Application

Once both the back-end and front-end servers are running, you can access the application by opening your web browser and navigating to `http://localhost:5173`.
