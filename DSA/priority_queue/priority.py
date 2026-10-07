class PriorityQueue:

    MAXSIZE = 100

    def __init__(self):
        self.heap = [0] * self.MAXSIZE
        self.heapsize = 0

    # Parent index
    def parent(self, i):
        return (i - 1) // 2

    # Left child index
    def leftchild(self, i):
        return 2 * i + 1

    # Right child index
    def rightchild(self, i):
        return 2 * i + 2

    # Swap two elements
    def swapelements(self, a, b):
        self.heap[a], self.heap[b] = self.heap[b], self.heap[a]

    # Move element upward
    def heapifyup(self, index):

        while index > 0 and self.heap[index] > self.heap[self.parent(index)]:

            self.swapelements(index, self.parent(index))

            index = self.parent(index)

    # Move element downward
    def heapifydown(self, index):

        while True:

            left = self.leftchild(index)
            right = self.rightchild(index)

            largest = index

            if left < self.heapsize and self.heap[left] > self.heap[largest]:
                largest = left

            if right < self.heapsize and self.heap[right] > self.heap[largest]:
                largest = right

            if largest == index:
                break

            self.swapelements(index, largest)

            index = largest

    # Check if empty
    def isempty(self):
        return self.heapsize == 0

    # Check if full
    def isfull(self):
        return self.heapsize == self.MAXSIZE

    # Return size
    def size(self):
        return self.heapsize

    # Insert element
    def insert(self, value):

        if self.isfull():
            print("Priority queue is full.")
            return

        self.heap[self.heapsize] = value

        self.heapsize += 1

        self.heapifyup(self.heapsize - 1)

        print("Element inserted successfully.")

    # Return highest priority element
    def peek(self):

        if self.isempty():
            print("Priority queue is empty.")
            return -1

        return self.heap[0]

    # Remove maximum element
    def extractmax(self):

        if self.isempty():
            print("Priority queue is empty.")
            return -1

        maxvalue = self.heap[0]

        self.heap[0] = self.heap[self.heapsize - 1]

        self.heapsize -= 1

        if self.heapsize > 0:
            self.heapifydown(0)

        return maxvalue

    # Delete a particular value
    def deleteelement(self, value):

        if self.isempty():
            print("Priority queue is empty.")
            return

        index = -1

        for i in range(self.heapsize):

            if self.heap[i] == value:
                index = i
                break

        if index == -1:
            print("Element not found.")
            return

        self.heap[index] = self.heap[self.heapsize - 1]

        self.heapsize -= 1

        if index < self.heapsize:

            if index > 0 and self.heap[index] > self.heap[self.parent(index)]:
                self.heapifyup(index)

            else:
                self.heapifydown(index)

        print("Element deleted successfully.")

    # Increase priority
    def increasekey(self, index, newvalue):

        if index < 0 or index >= self.heapsize:
            print("Invalid index.")
            return

        if newvalue < self.heap[index]:
            print("New value must be greater than current value.")
            return

        self.heap[index] = newvalue

        self.heapifyup(index)

        print("Priority increased successfully.")

    # Decrease priority
    def decreasekey(self, index, newvalue):

        if index < 0 or index >= self.heapsize:
            print("Invalid index.")
            return

        if newvalue > self.heap[index]:
            print("New value must be smaller than current value.")
            return

        self.heap[index] = newvalue

        self.heapifydown(index)

        print("Priority decreased successfully.")

    # Change priority
    def changepriority(self, index, newvalue):

        if index < 0 or index >= self.heapsize:
            print("Invalid index.")
            return

        oldvalue = self.heap[index]

        self.heap[index] = newvalue

        if newvalue > oldvalue:
            self.heapifyup(index)

        elif newvalue < oldvalue:
            self.heapifydown(index)

        print("Priority changed successfully.")

    # Build priority queue using array
    def buildpriorityqueue(self, arr, n):

        if n > self.MAXSIZE:
            print("Too many elements.")
            return

        for i in range(n):
            self.heap[i] = arr[i]

        self.heapsize = n

        for i in range(self.heapsize // 2 - 1, -1, -1):
            self.heapifydown(i)

        print("Priority queue built successfully.")

    # Display heap
    def display(self):

        if self.isempty():
            print("Priority queue is empty.")
            return

        for i in range(self.heapsize):
            print(self.heap[i], end=" ")

        print()