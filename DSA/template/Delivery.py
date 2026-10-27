class Order:
    def __init__(self, order_id, customer, address):
        self.order_id = order_id
        self.customer = customer
        self.address = address

    def __str__(self):
        return f"{self.order_id} {self.customer} {self.address}"


class Node:
    def __init__(self, order):
        self.order = order
        self.next = None


class DeliveryManager:
    def __init__(self):
        self.head = None
        self.tail = None
        self.count = 0

    def find_order(self, order_id):
        current = self.head

        while current is not None:
            if current.order.order_id == order_id:
                return current.order

            current = current.next

        return None

    def add_order(self, order_id, customer, address):
        if self.find_order(order_id) is not None:
            return False

        new_node = Node(Order(order_id, customer, address))

        if self.head is None:
            self.head = new_node
        else:
            self.tail.next = new_node

        self.tail = new_node
        self.count += 1
        return True

    def add_urgent(self, order_id, customer, address):
        if self.find_order(order_id) is not None:
            return False

        new_node = Node(Order(order_id, customer, address))
        new_node.next = self.head
        self.head = new_node

        if self.tail is None:
            self.tail = new_node

        self.count += 1
        return True

    def insert_after(
        self, existing_id, order_id, customer, address
    ):
        if self.find_order(order_id) is not None:
            return False

        current = self.head

        while current is not None:
            if current.order.order_id == existing_id:
                new_node = Node(Order(order_id, customer, address))

                new_node.next = current.next
                current.next = new_node

                if current is self.tail:
                    self.tail = new_node

                self.count += 1
                return True

            current = current.next

        return False

    def update_address(self, order_id, new_address):
        order = self.find_order(order_id)

        if order is None:
            return False

        order.address = new_address
        return True

    def cancel_order(self, order_id):
        previous = None
        current = self.head

        while current is not None:
            if current.order.order_id == order_id:
                if previous is None:
                    self.head = current.next
                else:
                    previous.next = current.next

                if current is self.tail:
                    self.tail = previous

                current.next = None
                self.count -= 1
                return current.order

            previous = current
            current = current.next

        return None

    def dispatch_next(self):
        if self.head is None:
            return None

        removed = self.head
        self.head = removed.next

        if self.head is None:
            self.tail = None

        removed.next = None
        self.count -= 1
        return removed.order

    def reverse_orders(self):
        previous = None
        current = self.head

        # The old first node becomes the last node.
        self.tail = self.head

        while current is not None:
            next_node = current.next
            current.next = previous
            previous = current
            current = next_node

        self.head = previous

    def size(self):
        return self.count

    def display(self):
        if self.head is None:
            print("EMPTY")
            return

        current = self.head

        while current is not None:
            print(current.order)
            current = current.next


# DRIVER — DO NOT MODIFY
def main():
    manager = DeliveryManager()

    print(manager.dispatch_next())

    print(manager.add_order(101, "Asha", "North"))
    print(manager.add_order(102, "Bala", "South"))
    print(manager.add_urgent(100, "Charu", "East"))

    print(manager.insert_after(101, 103, "Dev", "West"))
    print(manager.add_order(101, "Esha", "Central"))

    print("PENDING")
    manager.display()

    print("FOUND:", manager.find_order(103))
    print("UPDATED:", manager.update_address(103, "Park"))

    print("CANCELLED:", manager.cancel_order(102))
    print("DISPATCHED:", manager.dispatch_next())

    manager.reverse_orders()

    print("REVERSED")
    manager.display()

    print("SIZE:", manager.size())
    print("MISSING:", manager.cancel_order(999))


if __name__ == "__main__":
    main()