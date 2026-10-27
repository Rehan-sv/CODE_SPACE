class node:
    def __init__(self,data):
        self.data=data
        self.next=None
        
class queue:
    def __init__(self):
        self.head=None
        self.tail=None
        
    def enqueue(self,data):
        new=node(data)
        if self.head is None:
            self.head=self.tail=new
            return
        self.tail.next=new
        self.tail=new

    def dequeue(self):
        if self.head is None:
            print("queue is empty")
            return
        temp=self.head
        data=self.head.data
        self.head=self.head.next
        return data