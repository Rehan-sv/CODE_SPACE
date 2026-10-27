class Customer:
    def __init__(self, customer_id, name):
        self.customer_id = customer_id
        self.name = name

    def __str__(self):
        return f"{self.customer_id} {self.name}"


class Node:
    def __init__(self, customer):
        self.customer = customer
        self.next = None


class ServiceQueue:
    def __init__(self):
        self.front_node = None
        self.rear_node = None
        self.count = 0

    def is_empty(self):
        return self.front_node is None

    def size(self):
        return self.count

    def find_customer(self, customer_id):
        current = self.front_node

        while current is not None:
            if current.customer.customer_id == customer_id:
                return current.customer

            current = current.next

        return None

    def enqueue(self, customer_id, name):
        if self.find_customer(customer_id) is not None:
            return False

        new_node = Node(Customer(customer_id, name))

        if self.is_empty():
            self.front_node = new_node
        else:
            self.rear_node.next = new_node

        self.rear_node = new_node
        self.count += 1
        return True

    def dequeue(self):
        if self.is_empty():
            return None

        removed = self.front_node
        self.front_node = removed.next

        # Removing the only customer makes both ends empty.
        if self.front_node is None:
            self.rear_node = None

        removed.next = None
        self.count -= 1
        return removed.customer

    def peek_front(self):
        if self.is_empty():
            return None

        return self.front_node.customer

    def peek_rear(self):
        if self.is_empty():
            return None

        return self.rear_node.customer

    def cancel_customer(self, customer_id):
        previous = None
        current = self.front_node

        while current is not None:
            if current.customer.customer_id == customer_id:
                if previous is None:
                    return self.dequeue()

                previous.next = current.next

                if current is self.rear_node:
                    self.rear_node = previous

                current.next = None
                self.count -= 1
                return current.customer

            previous = current
            current = current.next

        return None

    def display(self):
        if self.is_empty():
            print("EMPTY")
            return

        current = self.front_node

        while current is not None:
            print(current.customer)
            current = current.next


def main():
    queue = ServiceQueue()

    print("SERVED:", queue.dequeue())

    print(queue.enqueue(101, "Asha"))
    print(queue.enqueue(102, "Bala"))
    print(queue.enqueue(103, "Charu"))
    print(queue.enqueue(104, "Dev"))

    print("DUPLICATE:", queue.enqueue(102, "Other"))

    print("WAITING")
    queue.display()

    print("NEXT:", queue.peek_front())
    print("LAST:", queue.peek_rear())
    print("FOUND:", queue.find_customer(103))

    print("CANCELLED:", queue.cancel_customer(103))
    print("SERVED:", queue.dequeue())

    print("WAITING")
    queue.display()

    print("SIZE:", queue.size())
    print("MISSING:", queue.cancel_customer(999))

    print("CANCELLED:", queue.cancel_customer(104))
    print("LAST:", queue.peek_rear())

    print("SERVED:", queue.dequeue())
    print("EMPTY:", queue.is_empty())
    print("LAST:", queue.peek_rear())


if __name__ == "__main__":
    main()