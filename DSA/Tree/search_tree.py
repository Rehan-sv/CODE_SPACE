class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
        self.parent = None


class BinaryTree:

    def __init__(self):
        self.root = None
        self.size = 0

    # INSERT
    def insert(self, data):

        new_node = Node(data)

        if self.root is None:
            self.root = new_node
            self.size += 1
            return

        current = self.root

        while True:

            if data < current.data:

                if current.left is None:
                    current.left = new_node
                    new_node.parent = current
                    break

                current = current.left

            else:

                if current.right is None:
                    current.right = new_node
                    new_node.parent = current
                    break

                current = current.right

        self.size += 1

    # SEARCH
    def search(self, key):

        current = self.root

        while current is not None:

            if current.data == key:
                return current

            if key < current.data:
                current = current.left
            else:
                current = current.right

        return None

    # DELETE
    def delete(self, key):

        current = self.search(key)

        if current is None:
            print("Key not found")
            return

        # CASE 1: Node has two children
        if current.left is not None and current.right is not None:

            successor = current.right

            while successor.left is not None:
                successor = successor.left

            current.data = successor.data
            current = successor

        # Find the child
        if current.left is not None:
            child = current.left
        else:
            child = current.right

        # Deleting root
        if current.parent is None:
            self.root = child

            if child is not None:
                child.parent = None

        # Current is left child
        elif current.parent.left == current:
            current.parent.left = child

            if child is not None:
                child.parent = current.parent

        # Current is right child
        else:
            current.parent.right = child

            if child is not None:
                child.parent = current.parent

        self.size -= 1

    # INORDER
    def inorder(self, node):

        if node is None:
            return

        self.inorder(node.left)
        print(node.data, end=" ")
        self.inorder(node.right)


# MAIN

tree = BinaryTree()

tree.insert(90)
tree.insert(80)
tree.insert(70)
tree.insert(60)
tree.insert(100)
tree.insert(95)
tree.insert(110)

print("Inorder:")
tree.inorder(tree.root)

print("\n")

print("Search 70:")
if tree.search(70):
    print("Found")
else:
    print("Not found")

print("Deleting 90...")
tree.delete(90)

print("After deletion:")
tree.inorder(tree.root)


# class Node:

#     def __init__(self, parent, data, left=None, right=None):
#         self.parent = parent
#         self.data = data
#         self.left = left
#         self.right = right

#     # Setters
#     def set_left(self, node):
#         self.left = node

#     def set_right(self, node):
#         self.right = node

#     def set_data(self, data):
#         self.data = data

#     # Getters
#     def get_left(self):
#         return self.left

#     def get_right(self):
#         return self.right

#     def get_data(self):
#         return self.data

#     def get_parent(self):
#         return self.parent


# class BinaryTree:

#     def __init__(self):
#         self.root = None
#         self.size = 0

#     def set_root(self, node):
#         self.root = node

#     def get_root(self):
#         return self.root

#     # INSERT
#     def insert(self, data):

#         if self.root is None:
#             self.root = Node(None, data)
#             self.size += 1
#             return

#         current = self.root
#         parent = None

#         while current is not None:

#             parent = current

#             if data < current.get_data():
#                 current = current.get_left()
#             else:
#                 current = current.get_right()

#         new_node = Node(parent, data)

#         if data < parent.get_data():
#             parent.set_left(new_node)
#         else:
#             parent.set_right(new_node)

#         self.size += 1

#     # SEARCH
#     def search(self, key):

#         current = self.root

#         while current is not None:

#             if current.get_data() == key:
#                 return current

#             if key < current.get_data():
#                 current = current.get_left()
#             else:
#                 current = current.get_right()

#         return None

#     # DELETE
#     def deletion(self, key):

#         current = self.search(key)

#         if current is None:
#             print("Key not found")
#             return

#         # Two children
#         if current.get_left() is not None and current.get_right() is not None:

#             successor = current.get_right()

#             while successor.get_left() is not None:
#                 successor = successor.get_left()

#             current.set_data(successor.get_data())
#             current = successor

#         # Find child
#         if current.get_left() is not None:
#             child = current.get_left()
#         else:
#             child = current.get_right()

#         parent = current.get_parent()

#         # Deleting root
#         if parent is None:

#             self.root = child

#             if child is not None:
#                 child.parent = None

#         # Current is left child
#         elif parent.get_left() == current:

#             parent.set_left(child)

#             if child is not None:
#                 child.parent = parent

#         # Current is right child
#         else:

#             parent.set_right(child)

#             if child is not None:
#                 child.parent = parent

#         self.size -= 1

#     # INORDER
#     def inorder(self, current):

#         if current is None:
#             return

#         self.inorder(current.get_left())
#         print(current.get_data(), end=" ")
#         self.inorder(current.get_right())


# # MAIN

# tree = BinaryTree()

# tree.insert(90)
# tree.insert(80)
# tree.insert(70)
# tree.insert(60)
# tree.insert(100)
# tree.insert(95)
# tree.insert(110)

# print("Inorder:")
# tree.inorder(tree.get_root())

# print("\nSearch:")
# if tree.search(70) is not None:
#     print("Found")
# else:
#     print("Not found")

# print("Deleting 90...")
# tree.deletion(90)

# print("After deletion:")
# tree.inorder(tree.get_root())