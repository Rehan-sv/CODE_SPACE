class DSU:

    def __init__(self, n):
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
            ra, rb = rb, ra

        self.parent[rb] = ra

        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1

        return True


class MinHeap:

    def __init__(self):
        self.heap = []

    def insert(self, item):
        self.heap.append(item)
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


class EdgeListGraph:

    def __init__(self, n):
        self.n = n
        self.edges = []

    def insert_edge(self, u, v, weight):
        self.edges.append((u, v, weight))

    def get_edge(self, u, v):
        for edge in self.edges:
            if (edge[0] == u and edge[1] == v) or (edge[0] == v and edge[1] == u):
                return edge
        return None

    def remove_edge(self, u, v): 
        for i in range(len(self.edges)):
            edge = self.edges[i]

            if (edge[0] == u and edge[1] == v) or (edge[0] == v and edge[1] == u):
                self.edges.pop(i)
                return

    def get_vertices(self):
        return list(range(self.n))

    def get_edges(self):
        return self.edges

    def incident_edges(self, v):
        result = []

        for edge in self.edges:
            if edge[0] == v or edge[1] == v:
                result.append(edge)

        return result

    def degree(self, v):
        count = 0

        for edge in self.edges:
            if edge[0] == v or edge[1] == v:
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

                for edge in self.edges:
                    if edge[0] == v:
                        u = edge[1]
                    elif edge[1] == v:
                        u = edge[0]
                    else:
                        continue

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

            for edge in self.edges:
                if edge[0] == v:
                    u = edge[1]
                elif edge[1] == v:
                    u = edge[0]
                else:
                    continue

                if not visited[u]:
                    visited[u] = True
                    queue.append(u)

        return result

    def kruskal(self):
        dsu = DSU(self.n)
        minheap = MinHeap()

        mst = []
        total = 0

        for u, v, w in self.edges:
            minheap.insert((w, u, v))

        while not minheap.is_empty() and len(mst) < self.n - 1:

            w, u, v = minheap.remove_min()

            if dsu.union(u, v):
                mst.append((u, v, w))
                total += w

        return mst, total

    def boruvka(self):
        dsu = DSU(self.n)

        mst = []
        total = 0
        components = self.n

        while components > 1:

            cheapest = [None] * self.n

            for u, v, w in self.edges:

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

        return mst, total