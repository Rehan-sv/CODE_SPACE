class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class SinglyLinkedList:

    def __init__(self):
        self.head = None

    def insert_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def insert_at_end(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
            return

        temp = self.head

        while temp.next:
            temp = temp.next

        temp.next = new_node

    def insert_after_node(self, prev_data, data):
        temp = self.head

        while temp:
            if temp.data == prev_data:
                new_node = Node(data)
                new_node.next = temp.next
                temp.next = new_node
                return

            temp = temp.next

        print("Node not found")

    def display(self):
        temp = self.head

        while temp:
            print(temp.data, end=" -> ")
            temp = temp.next

        print("None")


# Function to find Second Last Node
def second_last(head):

    if head is None or head.next is None:
        return None

    current_node = head

    while current_node.next.next:
        current_node = current_node.next

    return current_node.data


# MAIN

linked_list = SinglyLinkedList()

linked_list.insert_at_end(1)
linked_list.insert_at_end(2)
linked_list.insert_at_end(3)

linked_list.insert_at_beginning(0)

linked_list.insert_after_node(1, 1.5)

print("Linked List:")
linked_list.display()

second_last_node = second_last(linked_list.head)

print("Second Last Node =", second_last_node)