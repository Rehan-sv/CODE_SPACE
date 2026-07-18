class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class SinglyLinkedList:

    def __init__(self):
        self.head = None

    def insert_at_end(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
            return

        temp = self.head
        while temp.next:
            temp = temp.next
        temp.next = new_node

    def display(self):
        temp = self.head

        while temp:
            print(temp.data, end=" -> ")
            temp = temp.next
        print("None")


def kth_from_end(head, k):

    first = head
    second = head
    count = 0

    while first:
        first = first.next
        count += 1

        if count > k:
            second = second.next

    if count < k:
        return None

    return second.data


# ---------------- MAIN ----------------

linked_list = SinglyLinkedList()

# Insert elements
linked_list.insert_at_end(10)
linked_list.insert_at_end(20)
linked_list.insert_at_end(30)
linked_list.insert_at_end(40)
linked_list.insert_at_end(50)

print("Linked List:")
linked_list.display()

k = 2
print(f"{k}nd Node from End =", kth_from_end(linked_list.head, k))