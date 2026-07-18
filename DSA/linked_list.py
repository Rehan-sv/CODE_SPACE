class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


# Display the Linked List
def display(head):
    temp = head
    while temp:
        print(temp.data, end=" -> ")
        temp = temp.next


# Insert at Beginning
def insert_first(head, data):
    newNode = Node(data)
    newNode.next = head
    head = newNode
    return head


# Insert at End
def insert_last(head, data):
    newNode = Node(data)

    if head is None:
        return newNode

    temp = head
    while temp.next:
        temp = temp.next

    temp.next = newNode
    return head


# Delete First Node
def delete_first(head):
    if head is None:
        print("List is Empty")
        return None

    head = head.next
    return head

