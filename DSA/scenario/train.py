class Node:
    def __init__(self, pnr, name, timestamp):
        self.pnr = pnr
        self.name = name
        self.timestamp = timestamp
        self.next = None


class Waitlist:

    def __init__(self):
        self.head = None

    # --------------------------
    # ADD PASSENGER
    # --------------------------

    def addPassenger(self, pnr, name, timestamp):

        new_node = Node(pnr, name, timestamp)

        if self.head is None:
            self.head = new_node
            return

        temp = self.head

        while temp.next:
            temp = temp.next

        temp.next = new_node

    # --------------------------
    # FIND PASSENGER
    # --------------------------

    def findPassenger(self, pnr):

        temp = self.head
        pos = 1

        while temp:

            if temp.pnr == pnr:
                print("Position :", pos)
                return

            pos += 1
            temp = temp.next

        print("Not Found")

    # --------------------------
    # CANCEL PASSENGER
    # --------------------------

    def cancelPassenger(self, pnr):

        if self.head is None:
            return

        if self.head.pnr == pnr:
            self.head = self.head.next
            return

        prev = self.head
        curr = self.head.next

        while curr:

            if curr.pnr == pnr:
                prev.next = curr.next
                return

            prev = curr
            curr = curr.next

        print("Passenger Not Found")

    # --------------------------
    # CONFIRM NEXT
    # --------------------------

    def confirmNext(self):

        if self.head is None:
            print("Waitlist Empty")
            return

        print("Confirmed :", self.head.pnr, self.head.name)

        self.head = self.head.next

    # --------------------------
    # PRINT
    # --------------------------

    def display(self):

        temp = self.head

        while temp:

            print(temp.pnr,
                  temp.name,
                  temp.timestamp,
                  end=" -> ")

            temp = temp.next

        print("None")