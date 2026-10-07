class MaxHeap:

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

    # Heapify upward
    def heapifyup(self, index):

        while index > 0 and self.heap[index] > self.heap[self.parent(index)]:

            self.swapelements(index, self.parent(index))

            index = self.parent(index)

    # Heapify downward
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

    # Check if heap is empty
    def isempty(self):
        return self.heapsize == 0

    # Check if heap is full
    def isfull(self):
        return self.heapsize == self.MAXSIZE

    # Insert
    def insert(self, x):

        if self.isfull():
            print("The heap is full!!")
            return

        self.heap[self.heapsize] = x

        self.heapsize += 1

        self.heapifyup(self.heapsize - 1)

    # Delete a particular element
    def deleteelement(self, x):

        if self.isempty():
            print("The heap is empty.")
            return

        index = -1

        for i in range(self.heapsize):

            if self.heap[i] == x:
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

    # Peek maximum
    def peek(self):

        if self.isempty():
            print("The heap is empty.")
            return -1

        return self.heap[0]

    # Extract maximum
    def extractmax(self):

        if self.isempty():
            print("The heap is empty.")
            return -1

        maxvalue = self.heap[0]

        self.heap[0] = self.heap[self.heapsize - 1]

        self.heapsize -= 1

        if self.heapsize > 0:
            self.heapifydown(0)

        return maxvalue

    # Extract minimum
    def extractmin(self):

        if self.isempty():
            print("The heap is empty.")
            return -1

        # In a max heap, all leaves start from heapsize // 2
        firstleaf = self.heapsize // 2

        minindex = firstleaf

        for i in range(firstleaf + 1, self.heapsize):

            if self.heap[i] < self.heap[minindex]:
                minindex = i

        minvalue = self.heap[minindex]

        self.heap[minindex] = self.heap[self.heapsize - 1]

        self.heapsize -= 1

        if minindex < self.heapsize:

            if minindex > 0 and self.heap[minindex] > self.heap[self.parent(minindex)]:
                self.heapifyup(minindex)

            else:
                self.heapifydown(minindex)

        return minvalue

    # Build heap
    def buildheap(self, arr, n):

        if n > self.MAXSIZE:
            print("Too many elements.")
            return

        for i in range(n):
            self.heap[i] = arr[i]

        self.heapsize = n

        # Start from last non-leaf node
        for i in range(self.heapsize // 2 - 1, -1, -1):
            self.heapifydown(i)

        print("Heap built successfully.")

    # Heap sort
    def heapsort(self):

        if self.isempty():
            print("The heap is empty.")
            return

        # Copy heap so original heap is not changed
        temp = [0] * self.MAXSIZE

        originalsize = self.heapsize

        for i in range(self.heapsize):
            temp[i] = self.heap[i]

        print("Sorted elements:", end=" ")

        for i in range(originalsize - 1, -1, -1):

            # Swap root with last element
            temp[0], temp[i] = temp[i], temp[0]

            size = i
            index = 0

            # Heapify down inside temp
            while True:

                left = 2 * index + 1
                right = 2 * index + 2

                largest = index

                if left < size and temp[left] > temp[largest]:
                    largest = left

                if right < size and temp[right] > temp[largest]:
                    largest = right

                if largest == index:
                    break

                temp[index], temp[largest] = temp[largest], temp[index]

                index = largest

        for i in range(originalsize):
            print(temp[i], end=" ")

        print()

    # Display
    def display(self):

        if self.isempty():
            print("The heap is empty.")
            return

        for i in range(self.heapsize):
            print(self.heap[i], end=" ")

        print()