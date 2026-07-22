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
        if self.head is None:
            print("List is Empty")
            return

        temp = self.head

        print("List:", end=" ")

        while temp:
            print(temp.data, end=" ")
            temp = temp.next

        print()


# Driver Code

sll = SinglyLinkedList()

while True:

    print("\n----- MENU -----")
    print("1. Insert at First")
    print("2. Insert at Last")
    print("3. Delete First")
    print("4. Delete Last")
    print("5. Display List")
    print("6. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        data = int(input("Enter value: "))
        sll.insert_first(data)

    elif choice == 2:
        data = int(input("Enter value: "))
        sll.insert_last(data)

    elif choice == 3:
        sll.delete_first()

    elif choice == 4:
        sll.delete_last()

    elif choice == 5:
        sll.print_list()

    elif choice == 6:
        print("Program Ended")
        break

    else:
        print("Invalid Choice")