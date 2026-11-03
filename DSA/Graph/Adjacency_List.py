    class Vertex:

        def __init__(self, element):
            self.value = element
            self.index = None

        def element(self):
            return self.value


    class Edge:

        def __init__(self, u, v, element=None):
            self.origin = u
            self.destination = v
            self.value = element

        def endpoints(self):
            return (self.origin, self.destination)

        def opposite(self, vertex):
            if vertex is self.origin:
                return self.destination

            if vertex is self.destination:
                return self.origin

            raise ValueError('Vertex is not incident to this edge')

        def element(self):
            return self.value

    class PriorityQueue:

        def __init__(self):
            self.heap = []

        def insert(self, priority, item):
            self.heap.append((priority, item))

            i = len(self.heap) - 1

            while i > 0:
                parent = (i - 1) // 2

                if self.heap[i] < self.heap[parent]:
                    self.heap[i], self.heap[parent] = (self.heap[parent], self.heap[i])
                    i = parent
                else:
                    break

        def remove_min(self):
            if len(self.heap) == 0:
                return None

            minimum = self.heap[0]
            last = self.heap.pop()

            if len(self.heap) > 0:
                self.heap[0] = last
                i = 0

                while True:
                    left = 2 * i + 1
                    right = 2 * i + 2
                    smallest = i

                    if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
                        smallest = left

                    if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
                        smallest = right

                    if smallest != i:
                        self.heap[i], self.heap[smallest] = (self.heap[smallest], self.heap[i])
                        i = smallest
                    else:
                        break

            return minimum

        def is_empty(self):
            return len(self.heap) == 0

        def add(self, key, value):
            return self.insert(key, value)

        def min(self):
            return self.heap[0] if self.heap else None

        def __len__(self):
            return len(self.heap)

    class AdjacencyListGraph:

        def __init__(self):
            self.outgoing = {}
            self.n = 0

        def vertex_count(self):
            return len(self.outgoing)

        def edge_count(self):
            return sum(len(self.outgoing[v]) for v in self.outgoing) // 2

        def vertices(self):
            return iter(self.outgoing.keys())

        def edges(self):
            result = []
            for vertex in self.outgoing:
                for edge in self.outgoing[vertex]:
                    if edge not in result:
                        result.append(edge)
            return iter(result)

        def validate_vertex(self, v):
            if v not in self.outgoing:
                raise ValueError('Invalid vertex')

        def get_index(self, vertex):
            if isinstance(vertex, int):
                if vertex < 0 or vertex >= self.n:
                    raise ValueError('Invalid vertex index')
                return vertex

            self.validate_vertex(vertex)
            return vertex.index

        def get_edge(self, u, v):
            self.validate_vertex(u)
            self.validate_vertex(v)

            for edge in self.outgoing[u]:
                if edge.opposite(u) is v:
                    return edge

            return None

        def degree(self, vertex):
            self.validate_vertex(vertex)
            return len(self.outgoing[vertex])

        def incident_edges(self, vertex):
            self.validate_vertex(vertex)
            return list(self.outgoing[vertex])

        def insert_vertex(self, element=None):
            v = Vertex(element)
            v.index = self.n

            self.outgoing[v] = []
            self.n += 1

            return v

        def insert_edge(self, u, v, element=None):
            self.validate_vertex(u)
            self.validate_vertex(v)

            if self.get_edge(u, v) is not None:
                raise ValueError('Edge already exists')

            edge = Edge(u, v, element)

            self.outgoing[u].append(edge)

            if u is not v:
                self.outgoing[v].append(edge)

            return edge

        def remove_edge(self, edge):
            if not isinstance(edge, Edge):
                raise ValueError('Invalid edge')

            u = edge.origin
            v = edge.destination

            self.validate_vertex(u)
            self.validate_vertex(v)

            if edge not in self.outgoing[u]:
                raise ValueError('Invalid edge')

            self.outgoing[u].remove(edge)

            if u is not v:
                self.outgoing[v].remove(edge)

        def remove_vertex(self, vertex):
            self.validate_vertex(vertex)

            touching = list(self.outgoing[vertex])

            for edge in touching:
                self.remove_edge(edge)

            del self.outgoing[vertex]

            self.n -= 1
            vertex.index = -1

            for i, v in enumerate(self.vertices()):
                v.index = i

        def bfs(self, start):
            start = self.get_index(start)
            vertices = list(self.vertices())

            visited = [False] * self.n
            queue = [start]
            front = 0
            result = []

            visited[start] = True

            while front < len(queue):
                v = queue[front]
                front += 1

                result.append(v)

                for edge in self.outgoing[vertices[v]]:
                    u = edge.opposite(vertices[v]).index

                    if not visited[u]:
                        visited[u] = True
                        queue.append(u)

            return result

        def dfs(self, start):
            start = self.get_index(start)
            vertices = list(self.vertices())

            visited = [False] * self.n
            stack = [start]
            result = []

            while stack:
                v = stack.pop()

                if not visited[v]:
                    visited[v] = True
                    result.append(v)

                    for edge in self.outgoing[vertices[v]]:
                        u = edge.opposite(vertices[v]).index

                        if not visited[u]:
                            stack.append(u)

            return result

        # Prim's MST
        def prim_mst(self, start=None):

            if self.n == 0:
                return [], 0
            start = 0
            start = self.get_index(start)
            vertices = list(self.vertices())

            visited = [False] * self.n
            pq = PriorityQueue()

            mst = []
            total = 0

            pq.insert(0, (None, start, 0))

            while not pq.is_empty():

                weight, edge = pq.remove_min()

                parent, v, w = edge

                if visited[v]:
                    continue

                visited[v] = True

                if parent is not None:
                    mst.append((parent, v, w))
                    total += w

                for edge in self.outgoing[vertices[v]]:

                    u = edge.opposite(vertices[v]).index
                    edge_weight = edge.element()

                    if not visited[u]:
                        pq.insert(edge_weight, (v, u, edge_weight))

            return mst, total
        
        # Dijkstra
        def dijkstra(self, source):

            start = self.get_index(source)
            vertices = list(self.vertices())

            dist = [float('inf')] * self.n
            parent = [None] * self.n

            dist[start] = 0

            pq = PriorityQueue()
            pq.insert(0, start)

            while not pq is None:

                d, v = pq.remove_min()

                if d > dist[v]:
                    continue

                for edge in self.outgoing[vertices[v]]:

                    if edge.origin is vertices[v]:
                        u = edge.destination.index
                    else:
                        u = edge.origin.index

                    w = edge.element()

                    new_dist = d + w

                    if new_dist < dist[u]:
                        dist[u] = new_dist
                        parent[u] = v
                        pq.insert(new_dist, u)

            return dist, parent