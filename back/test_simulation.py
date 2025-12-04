import unittest
from simulation import Simulation, Node, Link

class TestSimulationRouting(unittest.TestCase):
    def setUp(self):
        self.sim = Simulation()
        
    def test_dijkstra_routing(self):
        # Create a topology where A->B->C is faster than A->C
        # A->C: Bandwidth 10 (High cost)
        # A->B: Bandwidth 100 (Low cost)
        # B->C: Bandwidth 100 (Low cost)
        nodes = [{"name": "A"}, {"name": "B"}, {"name": "C"}]
        links = [
            {"source": "A", "destination": "C", "bandwidth": 10, "latency": 0.01},
            {"source": "A", "destination": "B", "bandwidth": 100, "latency": 0.01},
            {"source": "B", "destination": "C", "bandwidth": 100, "latency": 0.01},
        ]
        self.sim.configure_network(nodes, links, global_queue_size=10)
        
        # Check routing table for A -> C
        # Cost A->C = 0.01 + 1/10 = 0.11
        # Cost A->B->C = (0.01 + 1/100) + (0.01 + 1/100) = 0.02 + 0.02 = 0.04
        # So A should route to B for destination C
        self.assertEqual(self.sim.routing_tables["A"]["C"], "B")

    def test_traffic_generation(self):
        nodes = [{"name": "A"}, {"name": "B"}]
        links = [{"source": "A", "destination": "B", "bandwidth": 100, "latency": 0.01}]
        self.sim.configure_network(nodes, links, global_queue_size=10)
        
        traffic_config = {"packet_rate": 100, "pattern": "constant"}
        self.sim.start_simulation(traffic_config, duration=100)
        
        # Check if packets were generated
        # Initial generation events should be in queue
        self.assertTrue(len(self.sim.event_queue) > 0)
        
        # Run for a bit
        self.sim.run()
        
        # Check metrics
        metrics = self.sim.get_metrics()
        self.assertTrue(metrics["throughput"] >= 0)

if __name__ == '__main__':
    unittest.main()
