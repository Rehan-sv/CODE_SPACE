class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class SinglyLinkedList:
    
    def __init__(self):
        self.head = None

    # Insert at First
    def insert_first(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    # Insert at Last
    def insert_last(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
        else:
            temp = self.head
            while temp.next:
                temp = temp.next
            temp.next = new_node

    # Delete First
    def delete_first(self):
        if self.head is None:
            print("List is Empty")
            return

        self.head = self.head.next

    # Delete Last
    def delete_last(self):
        if self.head is None:
            print("List is Empty")
            return

        if self.head.next is None:
            self.head = None
            return

        temp = self.head

        while temp.next.next:
            temp = temp.next

        temp.next = None

    # Print List
    def print_list(self):
        temp = self.head

        print("List:", end=" ")

        while temp:
            print(temp.data, end=" ")
            temp = temp.next

        print()


# Driver Code
sll = SinglyLinkedList()

sll.insert_first(20)
sll.insert_first(10)

sll.insert_last(30)
sll.insert_last(40)

sll.print_list()

sll.delete_first()
sll.print_list()

sll.delete_last()
sll.print_list()