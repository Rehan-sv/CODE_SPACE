
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


class DSU:

    def __init__(self, n=0):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]

        return x

    def union(self, a, b):
        ra = self.find(a)
        rb = self.find(b)

        if ra == rb:
            return False

        if self.rank[ra] < self.rank[rb]:
            ra, rb = (rb, ra)

        self.parent[rb] = ra

        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1

        return True

    def make_set(self, item):
        if not isinstance(item, int) or isinstance(item, bool) or item != len(self.parent):
            raise ValueError('Use the next unused integer position')

        self.parent.append(item)
        self.rank.append(0)

        return item


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


class EdgeListGraph:

    def __init__(self, directed=False):
        self.vertex_list = []
        self.edge_list = []
        self.directed = directed
        self.n = 0

    def is_directed(self):
        return self.directed

    def vertex_count(self):
        return len(self.vertex_list)

    def edge_count(self):
        return len(self.edge_list)

    def vertices(self):
        return iter(self.vertex_list)

    def edges(self):
        return iter(self.edge_list)

    def get_edge(self, u, v):
        self.validate_vertex(u)
        self.validate_vertex(v)

        for edge in self.edge_list:
            if edge.origin is u and edge.destination is v:
                return edge

            if not self.directed and edge.origin is v and (edge.destination is u):
                return edge

        return None

    def degree(self, vertex, outgoing=True):
        return len(self.incident_edges(vertex, outgoing))

    def incident_edges(self, vertex, outgoing=True):
        self.validate_vertex(vertex)

        result = []

        for edge in self.edge_list:
            if self.directed:
                if outgoing and edge.origin is vertex or (not outgoing and edge.destination is vertex):
                    result.append(edge)
            elif edge.origin is vertex or edge.destination is vertex:
                result.append(edge)

        return result

    def insert_vertex(self, element=None):
        v = Vertex(element)
        v.index = self.n
        self.vertex_list.append(v)
        self.n += 1

        return v

    def insert_edge(self, u, v, element=None):
        self.validate_vertex(u)
        self.validate_vertex(v)

        if self.get_edge(u, v) is not None:
            raise ValueError('Edge already exists between these vertices')

        edge = Edge(u, v, element)
        self.edge_list.append(edge)

        return edge

    def remove_edge(self, edge):
        if not isinstance(edge, Edge) or edge not in self.edge_list:
            raise ValueError('Invalid edge')

        self.edge_list.remove(edge)

    def remove_vertex(self, vertex):
        self.validate_vertex(vertex)

        self.edge_list = [edge for edge in self.edge_list if edge.origin is not vertex and edge.destination is not vertex]
        self.vertex_list.remove(vertex)
        self.n -= 1
        vertex.index = -1

        for i, v in enumerate(self.vertices()):
            v.index = i

    def bfs(self, start):
        start = self.get_index(start)
        visited = [False] * self.n
        queue = [start]
        front = 0
        result = []
        visited[start] = True

        while front < len(queue):
            v = queue[front]
            front += 1
            result.append(v)

            for edge in self.edge_list:
                if edge.origin.index == v:
                    u = edge.destination.index
                elif not self.directed and edge.destination.index == v:
                    u = edge.origin.index
                else:
                    continue

                if not visited[u]:
                    visited[u] = True
                    queue.append(u)

        return result

    def dfs(self, start):
        start = self.get_index(start)
        visited = [False] * self.n
        stack = [start]
        result = []

        while stack:
            v = stack.pop()

            if not visited[v]:
                visited[v] = True
                result.append(v)

                for edge in self.edge_list:
                    if edge.origin.index == v:
                        u = edge.destination.index
                    elif not self.directed and edge.destination.index == v:
                        u = edge.origin.index
                    else:
                        continue

                    if not visited[u]:
                        stack.append(u)

        return result

    def prim_mst(self, start=None):
        if self.directed:
            raise ValueError('MST requires an undirected graph')

        self.check_weights()

        if self.n == 0:
            if start is not None:
                self.get_index(start)

            return ([], 0)

        if start is None:
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

            for edge in self.incident_edges(vertices[v]):
                u = edge.opposite(vertices[v]).index
                edge_weight = edge.element()

                if not visited[u]:
                    pq.insert(edge_weight, (v, u, edge_weight))

        return (mst, total)

    def dijkstra(self, source):
        self.check_weights(nonnegative=True)

        start = self.get_index(source)
        vertices = list(self.vertices())
        dist = [float('inf')] * self.n
        parent = [None] * self.n
        dist[start] = 0
        pq = PriorityQueue()
        pq.insert(0, start)

        while not pq.is_empty():
            d, v = pq.remove_min()

            if d > dist[v]:
                continue

            for edge in self.incident_edges(vertices[v]):
                u = edge.opposite(vertices[v]).index
                w = edge.element()
                new_dist = d + w

                if new_dist < dist[u]:
                    dist[u] = new_dist
                    parent[u] = v
                    pq.insert(new_dist, u)

        return (dist, parent)

    def topological_order(self):
        if not self.directed:
            raise ValueError('Topological order requires a directed graph')

        vertices = list(self.vertices())
        in_degree = {v: self.degree(v, outgoing=False) for v in vertices}
        queue = [v for v in vertices if in_degree[v] == 0]
        front = 0
        result = []

        while front < len(queue):
            v = queue[front]
            front += 1
            result.append(v)

            for edge in self.incident_edges(v):
                u = edge.opposite(v)
                in_degree[u] -= 1

                if in_degree[u] == 0:
                    queue.append(u)

        if len(result) != len(vertices):
            raise ValueError('Graph contains a directed cycle')

        return result

    def topological_sort(self):
        return self.topological_order()