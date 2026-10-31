class PriorityQueue:

    def __init__(self):
        self.heap = []

    def insert(self, priority, item):
        self.heap.append((priority, item))
        i = len(self.heap) - 1

        while i > 0:
            parent = (i - 1) // 2

            if self.heap[i] < self.heap[parent]:
                self.heap[i], self.heap[parent] = self.heap[parent], self.heap[i]
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
                    self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
                    i = smallest
                else:
                    break

        return minimum

    def is_empty(self):
        return len(self.heap) == 0


class AdjacencyListGraph:

    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]

    def insert_edge(self, u, v, weight):
        self.adj[u].append((v, weight))
        self.adj[v].append((u, weight))

    def get_edge(self, u, v):
        for vertex, weight in self.adj[u]:
            if vertex == v:
                return (u, v, weight)

        return None

    def remove_edge(self, u, v):
        self.adj[u] = [
            (vertex, weight)
            for vertex, weight in self.adj[u]
            if vertex != v
        ]

        self.adj[v] = [
            (vertex, weight)
            for vertex, weight in self.adj[v]
            if vertex != u
        ]

    def get_vertices(self):
        return list(range(self.n))

    def get_edges(self):
        edges = []

        for u in range(self.n):
            for v, w in self.adj[u]:
                if u < v:
                    edges.append((u, v, w))

        return edges

    def incident_edges(self, v):
        result = []

        for u, w in self.adj[v]:
            result.append((v, u, w))

        return result

    def degree(self, v):
        return len(self.adj[v])

    def DFS(self, start):
        visited = [False] * self.n
        stack = [start]
        result = []

        while stack:
            v = stack.pop()

            if not visited[v]:
                visited[v] = True
                result.append(v)

                for u, w in self.adj[v]:
                    if not visited[u]:
                        stack.append(u)

        return result

    def BFS(self, start):
        visited = [False] * self.n
        queue = [start]
        front = 0
        result = []

        visited[start] = True

        while front < len(queue):
            v = queue[front]
            front += 1

            result.append(v)

            for u, w in self.adj[v]:
                if not visited[u]:
                    visited[u] = True
                    queue.append(u)

        return result

    def prim(self, start=0):
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

            for u, edge_weight in self.adj[v]:

                if not visited[u]:
                    pq.insert(edge_weight, (v, u, edge_weight))

        return mst, total

    def dijkstra(self, start):
        dist = [float('inf')] * self.n
        parent = [None] * self.n

        dist[start] = 0

        pq = PriorityQueue()
        pq.insert(0, start)

        while not pq.is_empty():

            d, v = pq.remove_min()

            if d > dist[v]:
                continue

            for u, w in self.adj[v]:

                new_dist = d + w

                if new_dist < dist[u]:

                    dist[u] = new_dist
                    parent[u] = v

                    pq.insert(new_dist, u)

        return dist, parent