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

class MinHeap:

    def __init__(self):
        self.heap = []

    def insert(self, item):
        self.heap.append(item)

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

    def add(self, item):
        return self.insert(item)

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

    def kruskal_mst(self):
        if self.directed:
            raise ValueError('MST requires an undirected graph')

        self.check_weights()

        dsu = DSU(self.n)
        minheap = MinHeap()
        mst = []
        total = 0

        for edge in self.edges():
            u, v = edge.endpoints()
            u, v = (u.index, v.index)
            w = edge.element()
            minheap.insert((w, u, v))

        while not minheap.is_empty() and len(mst) < self.n - 1:
            w, u, v = minheap.remove_min()

            if dsu.union(u, v):
                mst.append((u, v, w))
                total += w

        return (mst, total)

    def boruvka_mst(self):
        if self.directed:
            raise ValueError('MST requires an undirected graph')

        self.check_weights()

        dsu = DSU(self.n)
        mst = []
        total = 0
        components = self.n

        while components > 1:
            cheapest = [None] * self.n

            for edge in self.edges():
                u, v = edge.endpoints()
                u, v = (u.index, v.index)
                w = edge.element()
                ru = dsu.find(u)
                rv = dsu.find(v)

                if ru != rv:
                    if cheapest[ru] is None or w < cheapest[ru][2]:
                        cheapest[ru] = (u, v, w)

                    if cheapest[rv] is None or w < cheapest[rv][2]:
                        cheapest[rv] = (u, v, w)

            added = False

            for edge in cheapest:
                if edge is not None:
                    u, v, w = edge

                    if dsu.union(u, v):
                        mst.append((u, v, w))
                        total += w
                        components -= 1
                        added = True

            if not added:
                break

        return (mst, total)

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

