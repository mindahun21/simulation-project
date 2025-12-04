import heapq
import time
from collections import deque
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class Packet(BaseModel):
    id: int
    source: str
    destination: str
    timestamp: float
    size: int = 100

class Node(BaseModel):
    name: str
    queue: deque = Field(default_factory=deque)
    queue_size: int = 50
    packets_processed: int = 0
    packets_dropped: int = 0

class Link(BaseModel):
    source: str
    destination: str
    bandwidth: int = 100
    latency: float = 0.01 # in seconds

class Simulation:
    def __init__(self):
        self.nodes: Dict[str, Node] = {}
        self.links: Dict[str, List[Link]] = {}
        self.event_queue = []
        self.simulation_time = 0.0
        self.is_running = False
        self.metrics = {
            "latency": [],
            "throughput": 0,
            "packet_loss": 0,
        }
        self.packet_id_counter = 0

    def _calculate_routing_table(self):
        self.routing_tables = {}
        for source in self.nodes:
            self.routing_tables[source] = {}
            # Dijkstra's algorithm
            distances = {node: float('inf') for node in self.nodes}
            distances[source] = 0
            previous = {node: None for node in self.nodes}
            pq = [(0, source)]
            
            while pq:
                current_dist, current_node = heapq.heappop(pq)
                
                if current_dist > distances[current_node]:
                    continue
                
                if current_node in self.links:
                    for link in self.links[current_node]:
                        neighbor = link.destination
                        # Weight is latency + (1/bandwidth) * 1000 (to make bandwidth significant)
                        # Adjust weight calculation as needed for realism
                        weight = link.latency + (1.0 / link.bandwidth) 
                        distance = current_dist + weight
                        
                        if distance < distances[neighbor]:
                            distances[neighbor] = distance
                            previous[neighbor] = current_node
                            heapq.heappush(pq, (distance, neighbor))
            
            # Reconstruct paths
            for dest in self.nodes:
                if dest == source:
                    continue
                path = []
                curr = dest
                while curr is not None:
                    path.append(curr)
                    curr = previous[curr]
                path.reverse()
                if path and path[0] == source:
                     # The next hop is the second node in the path
                     if len(path) > 1:
                        self.routing_tables[source][dest] = path[1]

    def configure_network(self, nodes: List[Dict], links: List[Dict], global_queue_size: int = 50):
        # Support per-node queue size if provided, else use global default
        self.nodes = {}
        for node in nodes:
            q_size = node.get('queue_size', global_queue_size)
            self.nodes[node['name']] = Node(name=node['name'], queue_size=q_size)

        self.links = {}
        for link in links:
            if link['source'] not in self.links:
                self.links[link['source']] = []
            self.links[link['source']].append(Link(**link))
        
        self._calculate_routing_table()

    def start_simulation(self, traffic_config: Dict, duration: int, realtime: bool = True):
        self.is_running = True
        self.simulation_time = 0.0
        self.event_queue = []
        self.metrics = {"latency": [], "throughput": 0, "packet_loss": 0}
        self.packet_id_counter = 0
        self.event_counter = 0
        self.traffic_config = traffic_config
        self.realtime = realtime
        
        # Recalculate routing tables in case configuration changed
        self._calculate_routing_table()

        # Schedule initial packet generation events
        for node_name in self.nodes:
            self._schedule_packet_generation(node_name)

        # Schedule simulation end event
        self._push_event(duration, "SIMULATION_END", {})

        self.run()

    def create_topology(self, type: str, num_nodes: int, queue_size: int = 50, link_bandwidth: int = 100, link_latency: float = 0.01):
        nodes = [{"name": f"Node{i}", "queue_size": queue_size} for i in range(num_nodes)]
        links = []
        
        if type == "ring":
            for i in range(num_nodes):
                links.append({
                    "source": f"Node{i}",
                    "destination": f"Node{(i + 1) % num_nodes}",
                    "bandwidth": link_bandwidth,
                    "latency": link_latency
                })
        elif type == "mesh":
            for i in range(num_nodes):
                for j in range(num_nodes):
                    if i != j:
                        links.append({
                            "source": f"Node{i}",
                            "destination": f"Node{j}",
                            "bandwidth": link_bandwidth,
                            "latency": link_latency
                        })
        elif type == "star":
            center = "Node0"
            for i in range(1, num_nodes):
                # Bi-directional links to center
                links.append({"source": center, "destination": f"Node{i}", "bandwidth": link_bandwidth, "latency": link_latency})
                links.append({"source": f"Node{i}", "destination": center, "bandwidth": link_bandwidth, "latency": link_latency})
        elif type == "line":
            for i in range(num_nodes - 1):
                # Bi-directional line
                links.append({"source": f"Node{i}", "destination": f"Node{i+1}", "bandwidth": link_bandwidth, "latency": link_latency})
                links.append({"source": f"Node{i+1}", "destination": f"Node{i}", "bandwidth": link_bandwidth, "latency": link_latency})
        
        self.configure_network(nodes, links, global_queue_size=queue_size)

    def _push_event(self, time, event_type, data):
        heapq.heappush(self.event_queue, (time, self.event_counter, event_type, data))
        self.event_counter += 1

    def pause_simulation(self):
        self.is_running = False

    def resume_simulation(self):
        self.is_running = True
        self.run()

    def stop_simulation(self):
        self.is_running = False
        self._calculate_final_metrics()

    def reset_simulation(self):
        self.__init__()

    def run(self):
        import time
        start_wall_time = time.time()
        
        while self.event_queue and self.is_running:
            event_time, _, event_type, event_data = heapq.heappop(self.event_queue)
            
            if self.realtime:
                # Calculate how much time has passed in reality
                elapsed_wall = time.time() - start_wall_time
                # Calculate how much time should have passed in simulation (scaled if needed, but 1:1 for now)
                # If event is in the future relative to wall time, sleep
                # Convert simulation time (which might be in arbitrary units, but let's assume seconds for realtime)
                # In previous code, duration was passed as ms but used as is.
                # Let's assume simulation_time is in seconds.
                
                wait_time = event_time - elapsed_wall
                if wait_time > 0:
                    time.sleep(wait_time)
            
            self.simulation_time = event_time

            if event_type == "PACKET_GENERATION":
                self._handle_packet_generation(event_data)
            elif event_type == "PACKET_ARRIVAL":
                self._handle_packet_arrival(event_data)
            elif event_type == "SIMULATION_END":
                self.stop_simulation()
                break

    def _schedule_packet_generation(self, node_name: str):
        import random
        import math
        
        rate = self.traffic_config.get("packet_rate", 10)
        pattern = self.traffic_config.get("pattern", "constant")
        
        if pattern == "poisson":
            # Exponential distribution for inter-arrival time
            interval = -math.log(1.0 - random.random()) / rate
        elif pattern == "bursty":
            # Simple bursty model: 80% chance of short interval, 20% chance of long
            if random.random() < 0.8:
                interval = 1.0 / (rate * 5) # Burst
            else:
                interval = 1.0 / (rate / 5) # Idle
        else: # constant
            interval = 1.0 / rate

        generation_time = self.simulation_time + interval
        self._push_event(generation_time, "PACKET_GENERATION", {"node_name": node_name})

    def _handle_packet_generation(self, event_data):
        node_name = event_data["node_name"]
        
        # Only generate packet if there are other nodes reachable
        reachable_nodes = [dest for dest in self.nodes if dest != node_name and dest in self.routing_tables.get(node_name, {})]
        
        if reachable_nodes:
            import random
            destination_name = random.choice(reachable_nodes)

            packet = Packet(
                id=self.packet_id_counter,
                source=node_name,
                destination=destination_name,
                timestamp=self.simulation_time
            )
            self.packet_id_counter += 1
            # Directly schedule arrival at the source node's own queue
            self._schedule_arrival(node_name, packet)

        self._schedule_packet_generation(node_name)


    def _schedule_arrival(self, node_name: str, packet: Packet):
        arrival_time = self.simulation_time
        self._push_event(arrival_time, "PACKET_ARRIVAL", {"node_name": node_name, "packet": packet.dict()})

    def _handle_packet_arrival(self, event_data):
        node_name = event_data["node_name"]
        packet_data = event_data["packet"]
        packet = Packet(**packet_data)
        node = self.nodes[node_name]

        if packet.destination == node_name:
            # Packet reached destination
            latency = self.simulation_time - packet.timestamp
            self.metrics["latency"].append(latency)
            node.packets_processed += 1
            self.metrics["throughput"] += 1
        elif len(node.queue) < node.queue_size:
            node.queue.append(packet)
            self._process_queue(node_name)
        else:
            node.packets_dropped += 1
            self.metrics["packet_loss"] += 1


    def _process_queue(self, node_name: str):
        node = self.nodes[node_name]
        if node.queue:
            packet = node.queue[0] # Peek first
            
            # Find next hop
            next_hop = self.routing_tables.get(node_name, {}).get(packet.destination)
            
            if next_hop:
                # Find the link to next hop
                link = next((l for l in self.links.get(node_name, []) if l.destination == next_hop), None)
                
                if link:
                    node.queue.popleft() # Remove from queue only if we can send it
                    node.packets_processed += 1
                    travel_time = link.latency + packet.size / link.bandwidth
                    arrival_time = self.simulation_time + travel_time
                    self._push_event(arrival_time, "PACKET_ARRIVAL", {"node_name": next_hop, "packet": packet.dict()})
                else:
                     # Should not happen if routing table is correct, but handle gracefully
                     pass
            else:
                # No route found, drop packet? Or keep in queue?
                # For now, drop it to avoid blocking queue
                node.queue.popleft()
                node.packets_dropped += 1
                self.metrics["packet_loss"] += 1

    def _calculate_final_metrics(self):
        if self.metrics["latency"]:
            avg_latency = sum(self.metrics["latency"]) / len(self.metrics["latency"])
            self.metrics["latency"] = avg_latency
        else:
            self.metrics["latency"] = 0

    def get_status(self):
        return {
            "nodes": [
                {
                    "name": node.name,
                    "queue_length": len(node.queue),
                    "packets_processed": node.packets_processed,
                    "packet_dropped": node.packets_dropped,
                }
                for node in self.nodes.values()
            ]
        }

    def get_metrics(self):
        total_delivered = self.metrics["throughput"]
        total_dropped = self.metrics["packet_loss"]
        total_sent = total_delivered + total_dropped

        packet_loss_rate = total_dropped / total_sent if total_sent > 0 else 0
        
        # Calculate throughput as packets per second
        current_throughput = total_delivered / self.simulation_time if self.simulation_time > 0 else 0

        return {
            "latency": sum(self.metrics["latency"]) / len(self.metrics["latency"]) if isinstance(self.metrics["latency"], list) and self.metrics["latency"] else (self.metrics["latency"] if not isinstance(self.metrics["latency"], list) else 0),
            "throughput": current_throughput,
            "packet_loss": packet_loss_rate,
        }

    def get_topology(self):
        return {
            "nodes": [{"name": name, "queue_size": node.queue_size} for name, node in self.nodes.items()],
            "links": [
                {"source": source, "destination": link.destination, "bandwidth": link.bandwidth, "latency": link.latency}
                for source, links in self.links.items()
                for link in links
            ]
        }

