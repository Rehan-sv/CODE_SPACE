class Page:
    def __init__(self, page_id, title, url):
        self.page_id = page_id
        self.title = title
        self.url = url

    def __str__(self):
        return f"{self.page_id} {self.title} {self.url}"


class PageNode:
    def __init__(self, page):
        self.page = page
        self.prev = None
        self.next = None


class BrowserHistory:
    def __init__(self):
        self.head = None
        self.tail = None
        self.current = None

    def find_by_id(self, page_id):
        node = self.head

        while node is not None:
            if node.page.page_id == page_id:
                return node

            node = node.next

        return None

    def visit(self, page_id, title, url):
        # Check before discarding any forward history.
        if self.find_by_id(page_id) is not None:
            return False

        new_node = PageNode(Page(page_id, title, url))

        if self.head is None:
            self.head = new_node
        else:
            # Disconnect the existing forward history.
            if self.current.next is not None:
                self.current.next.prev = None

            self.current.next = new_node
            new_node.prev = self.current

        self.tail = new_node
        self.current = new_node
        return True

    def back(self):
        if self.current is None:
            return None

        if self.current.prev is not None:
            self.current = self.current.prev

        return self.current.page

    def forward(self):
        if self.current is None:
            return None

        if self.current.next is not None:
            self.current = self.current.next

        return self.current.page

    def search_url(self, url):
        node = self.head

        while node is not None:
            if node.page.url == url:
                return node.page

            node = node.next

        return None

    def delete_page(self, page_id):
        node = self.find_by_id(page_id)

        if node is None:
            return None

        # Move current before disconnecting the node.
        if node is self.current:
            if node.next is not None:
                self.current = node.next
            else:
                self.current = node.prev

        # Reconnect the previous neighbour.
        if node.prev is None:
            self.head = node.next
        else:
            node.prev.next = node.next

        # Reconnect the next neighbour.
        if node.next is None:
            self.tail = node.prev
        else:
            node.next.prev = node.prev

        node.prev = None
        node.next = None

        return node.page

    def go_first(self):
        self.current = self.head

        if self.current is None:
            return None

        return self.current.page

    def go_last(self):
        self.current = self.tail

        if self.current is None:
            return None

        return self.current.page

    def duplicate_current(self, new_id):
        if self.current is None:
            return False

        if self.find_by_id(new_id) is not None:
            return False

        original = self.current.page

        # Create a separate Page object.
        new_node = PageNode(
            Page(new_id, original.title, original.url)
        )

        # Insert between current and its next node.
        new_node.prev = self.current
        new_node.next = self.current.next

        if self.current.next is not None:
            self.current.next.prev = new_node
        else:
            self.tail = new_node

        self.current.next = new_node
        self.current = new_node
        return True

    def display(self):
        if self.head is None:
            print("EMPTY")
            return

        node = self.head

        while node is not None:
            print(node.page)
            node = node.next


# DRIVER — DO NOT MODIFY
def main():
    browser = BrowserHistory()

    print("BACK:", browser.back())

    print(browser.visit(1, "Home", "home.com"))
    print(browser.visit(2, "Learn", "learn.com"))
    print(browser.visit(3, "Practice", "practice.com"))

    print("BACK:", browser.back())

    # Visiting from page 2 must discard page 3.
    print(browser.visit(4, "Notes", "notes.com"))
    print("REMOVED:", browser.search_url("practice.com"))

    print("FIRST:", browser.go_first())
    print("NEXT:", browser.forward())

    # Duplicate page 2, preserving page 4 after it.
    print("DUPLICATED:", browser.duplicate_current(5))

    print("HISTORY")
    browser.display()

    # Deleting current page 5 moves current to page 4.
    print("DELETED:", browser.delete_page(5))
    print("LAST:", browser.go_last())

    print("DELETED:", browser.delete_page(1))
    print("FOUND:", browser.search_url("learn.com"))

    print(
        "DUPLICATE ID:",
        browser.visit(4, "Other", "other.com")
    )
    print("MISSING:", browser.delete_page(99))

    print("FINAL")
    browser.display()


if __name__ == "__main__":
    main()