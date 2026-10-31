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


class AdjacencyMatrixGraph:

    def __init__(self, n):
        self.n = n
        self.matrix = [[None] * n for _ in range(n)]

    def insert_edge(self, u, v, weight):
        self.matrix[u][v] = weight
        self.matrix[v][u] = weight

    def get_edge(self, u, v):
        if self.matrix[u][v] is not None:
            return (u, v, self.matrix[u][v])

        return None

    def remove_edge(self, u, v):
        self.matrix[u][v] = None
        self.matrix[v][u] = None

    def get_vertices(self):
        return list(range(self.n))

    def get_edges(self):
        edges = []

        for u in range(self.n):
            for v in range(u + 1, self.n):

                if self.matrix[u][v] is not None:
                    edges.append((u, v, self.matrix[u][v]))

        return edges

    def incident_edges(self, v):
        result = []

        for u in range(self.n):

            if self.matrix[v][u] is not None:
                result.append((v, u, self.matrix[v][u]))

        return result

    def degree(self, v):
        count = 0

        for u in range(self.n):

            if self.matrix[v][u] is not None:
                count += 1

        return count

    def DFS(self, start):
        visited = [False] * self.n
        stack = [start]
        result = []

        while stack:

            v = stack.pop()

            if not visited[v]:

                visited[v] = True
                result.append(v)

                for u in range(self.n):

                    if self.matrix[v][u] is not None and not visited[u]:
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

            for u in range(self.n):

                if self.matrix[v][u] is not None and not visited[u]:
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

            for u in range(self.n):

                edge_weight = self.matrix[v][u]

                if edge_weight is not None and not visited[u]:
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

            for u in range(self.n):

                w = self.matrix[v][u]

                if w is not None:

                    new_dist = d + w

                    if new_dist < dist[u]:

                        dist[u] = new_dist
                        parent[u] = v

                        pq.insert(new_dist, u)

        return dist, parent