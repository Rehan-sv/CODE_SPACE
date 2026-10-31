

class Vertex:
    def __init__(self, element):
        self._element = element

    def element(self):
        return self._element


# -------------------- Edge --------------------

class Edge:
    def __init__(self, u, v, element=None):
        self._origin = u
        self._destination = v
        self._element = element

    def endpoints(self):
        return self._origin, self._destination

    def opposite(self, vertex):
        if vertex is self._origin:
            return self._destination
        if vertex is self._destination:
            return self._origin
        raise ValueError("Vertex is not incident to this edge")

    def element(self):
        return self._element


# -------------------- Disjoint Set Union --------------------

class DisjointSetUnion:
    def __init__(self):
        self._parent = {}
        self._size = {}

    def make_set(self, item):
        # TODO: Create a singleton set for item.
        raise NotImplementedError

    def find(self, item):
        # TODO: Return the representative; consider path compression.
        raise NotImplementedError

    def union(self, a, b):
        # TODO: Merge the sets; consider union by size/rank.
        raise NotImplementedError


# -------------------- Priority Queue --------------------

class PriorityQueue:
    def __init__(self):
        self._data = []

    def add(self, key, value):
        # TODO: Insert (key, value) with priority key.
        raise NotImplementedError

    def min(self):
        # TODO: Return the minimum (key, value) without removing it.
        raise NotImplementedError

    def remove_min(self):
        # TODO: Remove and return the minimum (key, value).
        raise NotImplementedError

    def is_empty(self):
        return len(self._data) == 0

    def __len__(self):
        return len(self._data)


# -------------------- Min Heap --------------------

class MinHeap:
    def __init__(self):
        self._data = []

    def add(self, item):
        # TODO: Insert item into the min heap.
        raise NotImplementedError

    def min(self):
        # TODO: Return the minimum item without removing it.
        raise NotImplementedError

    def remove_min(self):
        # TODO: Remove and return the minimum item.
        raise NotImplementedError

    def is_empty(self):
        return len(self._data) == 0

    def __len__(self):
        return len(self._data)


# ============================================================
# 1. EDGE LIST GRAPH
# ============================================================

class EdgeListGraph:
    def __init__(self, directed=False):
        self._vertices = []
        self._edges = []
        self._directed = directed

    # Graph operations
    def is_directed(self):
        return self._directed

    def vertex_count(self):
        return len(self._vertices)

    def edge_count(self):
        return len(self._edges)

    def vertices(self):
        return iter(self._vertices)

    def edges(self):
        return iter(self._edges)

    def get_edge(self, u, v):
        # TODO
        raise NotImplementedError

    def degree(self, vertex, outgoing=True):
        # TODO
        raise NotImplementedError

    def incident_edges(self, vertex, outgoing=True):
        # TODO
        raise NotImplementedError

    def insert_vertex(self, element=None):
        # TODO
        raise NotImplementedError

    def insert_edge(self, u, v, element=None):
        # TODO
        raise NotImplementedError

    def remove_edge(self, edge):
        # TODO
        raise NotImplementedError

    def remove_vertex(self, vertex):
        # TODO
        raise NotImplementedError

    # Traversals
    def bfs(self, start):
        # TODO: Breadth-first search.
        raise NotImplementedError

    def dfs(self, start):
        # TODO: Depth-first search.
        raise NotImplementedError

    # Minimum spanning trees
    def prim_mst(self, start=None):
        # TODO: Prim's minimum spanning tree using PriorityQueue.
        raise NotImplementedError

    def kruskal_mst(self):
        # TODO: Kruskal's minimum spanning tree using MinHeap and DSU.
        raise NotImplementedError

    def boruvka_mst(self):
        # TODO: Boruvka's minimum spanning tree using DSU.
        raise NotImplementedError

    # Shortest paths
    def dijkstra(self, source):
        # TODO: Dijkstra's shortest paths using PriorityQueue.
        raise NotImplementedError

    # Topological algorithms
    def topological_order(self):
        # TODO: Return a topological ordering for a DAG.
        raise NotImplementedError

    def topological_sort(self):
        # TODO: Perform topological sort; define the desired return format.
        raise NotImplementedError


# ============================================================
# 2. ADJACENCY LIST GRAPH
# ============================================================

class AdjacencyListGraph:
    def __init__(self, directed=False):
        self._outgoing = {}
        self._incoming = {} if directed else self._outgoing
        self._directed = directed

    # Graph operations
    def is_directed(self):
        return self._directed

    def vertex_count(self):
        return len(self._outgoing)

    def edge_count(self):
        # TODO: Count edges without double-counting undirected edges.
        raise NotImplementedError

    def vertices(self):
        return iter(self._outgoing.keys())

    def edges(self):
        # TODO: Return graph edges without duplicates.
        raise NotImplementedError

    def get_edge(self, u, v):
        # TODO
        raise NotImplementedError

    def degree(self, vertex, outgoing=True):
        # TODO
        raise NotImplementedError

    def incident_edges(self, vertex, outgoing=True):
        # TODO
        raise NotImplementedError

    def insert_vertex(self, element=None):
        # TODO
        raise NotImplementedError

    def insert_edge(self, u, v, element=None):
        # TODO
        raise NotImplementedError

    def remove_edge(self, edge):
        # TODO
        raise NotImplementedError

    def remove_vertex(self, vertex):
        # TODO
        raise NotImplementedError

    # Traversals
    def bfs(self, start):
        # TODO: Breadth-first search.
        raise NotImplementedError

    def dfs(self, start):
        # TODO: Depth-first search.
        raise NotImplementedError

    # Minimum spanning trees
    def prim_mst(self, start=None):
        # TODO: Prim's minimum spanning tree using PriorityQueue.
        raise NotImplementedError

    def kruskal_mst(self):
        # TODO: Kruskal's minimum spanning tree using MinHeap and DSU.
        raise NotImplementedError

    def boruvka_mst(self):
        # TODO: Boruvka's minimum spanning tree using DSU.
        raise NotImplementedError

    # Shortest paths
    def dijkstra(self, source):
        # TODO: Dijkstra's shortest paths using PriorityQueue.
        raise NotImplementedError

    # Topological algorithms
    def topological_order(self):
        # TODO: Return a topological ordering for a DAG.
        raise NotImplementedError

    def topological_sort(self):
        # TODO: Perform topological sort; define the desired return format.
        raise NotImplementedError


# ============================================================
# 3. ADJACENCY MATRIX GRAPH
# ============================================================

class AdjacencyMatrixGraph:
    def __init__(self, directed=False):
        self._vertices = []
        self._index = {}
        self._present = []
        self._weight = []
        self._directed = directed

    # Graph operations
    def is_directed(self):
        return self._directed

    def vertex_count(self):
        return len(self._vertices)

    def edge_count(self):
        # TODO: Count edges without double-counting undirected edges.
        raise NotImplementedError

    def vertices(self):
        return iter(self._vertices)

    def edges(self):
        # TODO: Return graph edges without duplicates.
        raise NotImplementedError

    def get_edge(self, u, v):
        # TODO
        raise NotImplementedError

    def degree(self, vertex, outgoing=True):
        # TODO
        raise NotImplementedError

    def incident_edges(self, vertex, outgoing=True):
        # TODO
        raise NotImplementedError

    def insert_vertex(self, element=None):
        # TODO: Expand the matrix when a vertex is added.
        raise NotImplementedError

    def insert_edge(self, u, v, element=None):
        # TODO: Store edge presence and weight in the matrix.
        raise NotImplementedError

    def remove_edge(self, edge):
        # TODO: Remove edge from matrix.
        raise NotImplementedError

    def remove_vertex(self, vertex):
        # TODO: Remove its row and column and update indices.
        raise NotImplementedError

    # Traversals
    def bfs(self, start):
        # TODO: Breadth-first search by scanning matrix rows.
        raise NotImplementedError

    def dfs(self, start):
        # TODO: Depth-first search by scanning matrix rows.
        raise NotImplementedError

    # Minimum spanning trees
    def prim_mst(self, start=None):
        # TODO: Prim's minimum spanning tree using PriorityQueue.
        raise NotImplementedError

    def kruskal_mst(self):
        # TODO: Kruskal's minimum spanning tree using MinHeap and DSU.
        raise NotImplementedError

    def boruvka_mst(self):
        # TODO: Boruvka's minimum spanning tree using DSU.
        raise NotImplementedError

    # Shortest paths
    def dijkstra(self, source):
        # TODO: Dijkstra's shortest paths using PriorityQueue.
        raise NotImplementedError

    # Topological algorithms
    def topological_order(self):
        # TODO: Return a topological ordering for a DAG.
        raise NotImplementedError

    def topological_sort(self):
        # TODO: Perform topological sort; define the desired return format.
        raise NotImplementedError
