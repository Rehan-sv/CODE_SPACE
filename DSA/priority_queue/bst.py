class Node:

    def __init__(self, value):
        self.data = value
        self.left = None
        self.right = None


class BST:

    def __init__(self):
        self.root = None

    # =========================
    # INSERT
    # =========================

    def insertNode(self, root, value):

        if root is None:
            return Node(value)

        if value < root.data:
            root.left = self.insertNode(root.left, value)

        elif value > root.data:
            root.right = self.insertNode(root.right, value)

        return root

    # =========================
    # SEARCH
    # =========================

    def searchNode(self, root, value):

        if root is None:
            return False

        if root.data == value:
            return True

        if value < root.data:
            return self.searchNode(root.left, value)

        else:
            return self.searchNode(root.right, value)

    # =========================
    # INORDER
    # =========================

    def inorderTraversal(self, root):

        if root is None:
            return

        self.inorderTraversal(root.left)

        print(root.data, end=" ")

        self.inorderTraversal(root.right)

    # =========================
    # PREORDER
    # =========================

    def preorderTraversal(self, root):

        if root is None:
            return

        print(root.data, end=" ")

        self.preorderTraversal(root.left)

        self.preorderTraversal(root.right)

    # =========================
    # POSTORDER
    # =========================

    def postorderTraversal(self, root):

        if root is None:
            return

        self.postorderTraversal(root.left)

        self.postorderTraversal(root.right)

        print(root.data, end=" ")

    # =========================
    # FIND MINIMUM
    # =========================

    def findMinNode(self, root):

        if root is None:
            return None

        while root.left is not None:
            root = root.left

        return root

    # =========================
    # FIND MAXIMUM
    # =========================

    def findMaxNode(self, root):

        if root is None:
            return None

        while root.right is not None:
            root = root.right

        return root

    # =========================
    # DELETE
    # =========================

    def deleteNode(self, root, value):

        if root is None:
            return root

        if value < root.data:

            root.left = self.deleteNode(root.left, value)

        elif value > root.data:

            root.right = self.deleteNode(root.right, value)

        else:

            # Case 1: No left child
            if root.left is None:

                temp = root.right

                return temp

            # Case 2: No right child
            elif root.right is None:

                temp = root.left

                return temp

            # Case 3: Two children
            temp = self.findMinNode(root.right)

            root.data = temp.data

            root.right = self.deleteNode(
                root.right,
                temp.data
            )

        return root

    # =========================
    # HEIGHT
    # =========================

    def heightNode(self, root):

        if root is None:
            return -1

        leftheight = self.heightNode(root.left)

        rightheight = self.heightNode(root.right)

        return 1 + max(leftheight, rightheight)

    # =========================
    # COUNT TOTAL NODES
    # =========================

    def countNodes(self, root):

        if root is None:
            return 0

        return (
            1
            + self.countNodes(root.left)
            + self.countNodes(root.right)
        )

    # =========================
    # COUNT LEAF NODES
    # =========================

    def countLeafNodes(self, root):

        if root is None:
            return 0

        if root.left is None and root.right is None:
            return 1

        return (
            self.countLeafNodes(root.left)
            + self.countLeafNodes(root.right)
        )

    # =========================
    # FIND PREDECESSOR
    # =========================

    def findPredecessor(self, root, value):

        predecessor = None

        while root is not None:

            if value > root.data:

                predecessor = root

                root = root.right

            elif value < root.data:

                root = root.left

            else:

                if root.left is not None:

                    predecessor = self.findMaxNode(root.left)

                break

        return predecessor

    # =========================
    # FIND SUCCESSOR
    # =========================

    def findSuccessor(self, root, value):

        successor = None

        while root is not None:

            if value < root.data:

                successor = root

                root = root.left

            elif value > root.data:

                root = root.right

            else:

                if root.right is not None:

                    successor = self.findMinNode(root.right)

                break

        return successor

    # =========================
    # FIND LCA
    # =========================

    def findLCA(self, root, a, b):

        if root is None:
            return None

        if a < root.data and b < root.data:

            return self.findLCA(root.left, a, b)

        if a > root.data and b > root.data:

            return self.findLCA(root.right, a, b)

        return root

    # =========================================================
    # PUBLIC FUNCTIONS
    # =========================================================

    def insert(self, value):

        self.root = self.insertNode(self.root, value)

    def search(self, value):

        return self.searchNode(self.root, value)

    def inorder(self):

        self.inorderTraversal(self.root)
        print()

    def preorder(self):

        self.preorderTraversal(self.root)
        print()

    def postorder(self):

        self.postorderTraversal(self.root)
        print()

    def findmin(self):

        temp = self.findMinNode(self.root)

        if temp is None:

            print("Tree is empty.")
            return

        print("Minimum:", temp.data)

    def findmax(self):

        temp = self.findMaxNode(self.root)

        if temp is None:

            print("Tree is empty.")
            return

        print("Maximum:", temp.data)

    def deleteelement(self, value):

        if not self.search(value):

            print("Element not found.")
            return

        self.root = self.deleteNode(self.root, value)

        print("Element deleted successfully.")

    def height(self):

        return self.heightNode(self.root)

    def countnodes(self):

        return self.countNodes(self.root)

    def countleafnodes(self):

        return self.countLeafNodes(self.root)

    def predecessor(self, value):

        if not self.search(value):

            print("Element not found.")
            return

        temp = self.findPredecessor(self.root, value)

        if temp is not None:

            print("Predecessor:", temp.data)

        else:

            print("No predecessor found.")

    def successor(self, value):

        if not self.search(value):

            print("Element not found.")
            return

        temp = self.findSuccessor(self.root, value)

        if temp is not None:

            print("Successor:", temp.data)

        else:

            print("No successor found.")

    def lca(self, a, b):

        if not self.search(a) or not self.search(b):

            print("One or both elements not found.")
            return

        temp = self.findLCA(self.root, a, b)

        if temp is not None:

            print("LCA:", temp.data)