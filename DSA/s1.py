class node:
    def __init__(self, data):
        self.data = data
        self.next = None


class single:

    def __init__(self):
        self.head = None

    def insert_f(self, data):
        new_node = node(data)
        new_node.next = self.head
        self.head = new_node

    def insert_l(self, data):
        new_node = node(data)

        if self.head is None:
            self.head = new_node
        else:
            temp = self.head
            while temp.next:
                temp = temp.next
            temp.next = new_node

    def print(self):
        if self.head is None:
            print("No value")
        else:
            temp = self.head
            while temp:
                print(temp.data, end=" --> ")
                temp = temp.next
            print("None")
            
    def rev(self):
        prev=None
        curr=self.head
        
        while curr:
            temp=curr.next
            curr.next=prev
            prev=curr
            curr=temp
            self.head=prev



s = single()

s.insert_f(10)
s.insert_f(20)
s.insert_l(30)
s.insert_l(40)
s.rev()

s.print()