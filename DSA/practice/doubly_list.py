class DNode:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    # --- ADD OPERATIONS ---
    def add_first(self, data):
        new_node = DNode(data)
        if self.head:
            self.head.prev = new_node
            new_node.next = self.head
        self.head = new_node

    def add_last(self, data):
        new_node = DNode(data)
        if not self.head:
            self.head = new_node
            return
        temp= self.head
        while temp.next:
            temp= temp.next
        temp.next = new_node
        new_node.prev = temp

    def add_at(self, index, data):
        if index == 0:
            self.add_first(data)
            return
        new_node = DNode(data)
        temp= self.head
        for _ in range(index - 1):
            if not temp:
                raise IndexError("Index out of bounds")
            temp= temp.next
        new_node.next = temp.next
        new_node.prev = temp
        if temp.next:
            temp.next.prev = new_node
        temp.next = new_node

    # --- REMOVE OPERATIONS ---
    def remove_first(self):
        if not self.head:
            return
        self.head = self.head.next
        if self.head:
            self.head.prev = None

    def remove_last(self):
        if not self.head:
            return
        if not self.head.next:
            self.head = None
            return
        temp= self.head
        while temp.next:
            temp= temp.next
        temp.prev.next = None

    def remove_at(self, index):
        if not self.head:
            return
        if index == 0:
            self.remove_first()
            return
        temp= self.head
        for _ in range(index):
            if not temp:
                raise IndexError("Index out of bounds")
            temp= temp.next
        if temp.next:
            temp.next.prev = temp.prev
        if temp.prev:
            temp.prev.next = temp.next
            
    def reve(self):
        temp=self.head
        
        while temp is not None:
            temp.prev,temp.next=temp.next,temp.prev
            temp=temp.prev 
        self.head,self.tail=self.tail,self.head
        
        
    def display(self):
        nodes = []
        temp= self.head
        while temp:
            nodes.append(str(temp.data))
            temp= temp.next
        print(" <-> ".join(nodes) + (" <-> None" if nodes else "None"))