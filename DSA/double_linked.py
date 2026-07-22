class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None


class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    # Insert at First
    def insert_first(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node

    # Insert at Last
    def insert_last(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = self.tail = new_node
        else:
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node

    # Delete First
    def delete_first(self):
        if self.head is None:
            print("List is Empty")
            return

        if self.head == self.tail:
            self.head = self.tail = None
        else:
            self.head = self.head.next
            self.head.prev = None

    # Delete Last
    def delete_last(self):
        if self.head is None:
            print("List is Empty")
            return

        if self.head == self.tail:
            self.head = self.tail = None
        else:
            self.tail = self.tail.prev
            self.tail.next = None

    # Print Forward
    def print_forward(self):
        temp = self.head
        print("Forward:", end=" ")

        while temp:
            print(temp.data, end=" ")
            temp = temp.next
        print()

    # Print Backward
    def print_backward(self):
        temp = self.tail
        print("Backward:", end=" ")

        while temp:
            print(temp.data, end=" ")
            temp = temp.prev
        print()


# Driver Code
dll = DoublyLinkedList()

dll.insert_first(20)
dll.insert_first(10)

dll.insert_last(30)
dll.insert_last(40)

dll.print_forward()
dll.print_backward()

dll.delete_first()
dll.print_forward()

dll.delete_last()
dll.print_forward()
dll.print_backward()