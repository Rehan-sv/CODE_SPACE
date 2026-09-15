#include <iostream>
using namespace std;


class Node
{
public:
    int data;
    Node* left;
    Node* right;
    Node* parent;

    Node(int data)
    {
        this->data = data;
        this->left = nullptr;
        this->right = nullptr;
        this->parent = nullptr;
    }
};


// =========================
// BINARY SEARCH TREE CLASS
// =========================

class BinaryTree
{
private:
    Node* root;
    int size;

public:

    // CONSTRUCTOR
    BinaryTree()
    {
        root = nullptr;
        size = 0;
    }


    // =========================
    // INSERT
    // =========================

    void insert(int data)
    {
        Node* newNode = new Node(data);

        // Tree is empty
        if (root == nullptr)
        {
            root = newNode;
            size++;
            return;
        }

        Node* current = root;

        while (true)
        {
            // Go to left
            if (data < current->data)
            {
                if (current->left == nullptr)
                {
                    current->left = newNode;
                    newNode->parent = current;
                    break;
                }

                current = current->left;
            }

            // Go to right
            else
            {
                if (current->right == nullptr)
                {
                    current->right = newNode;
                    newNode->parent = current;
                    break;
                }

                current = current->right;
            }
        }

        size++;
    }


    // =========================
    // SEARCH
    // =========================

    Node* search(int key)
    {
        Node* current = root;

        while (current != nullptr)
        {
            if (current->data == key)
            {
                return current;
            }

            if (key < current->data)
            {
                current = current->left;
            }
            else
            {
                current = current->right;
            }
        }

        return nullptr;
    }


    // =========================
    // DELETE
    // =========================

    void deletion(int key)
    {
        Node* current = search(key);

        if (current == nullptr)
        {
            cout << "Key not found" << endl;
            return;
        }


        // =========================
        // CASE 1:
        // NODE HAS TWO CHILDREN
        // =========================

        if (current->left != nullptr &&
            current->right != nullptr)
        {
            Node* successor = current->right;

            // Find smallest node
            // in right subtree
            while (successor->left != nullptr)
            {
                successor = successor->left;
            }

            // Copy successor's data
            current->data = successor->data;

            // Now delete successor
            current = successor;
        }


        // =========================
        // FIND CHILD
        // =========================

        Node* child;

        if (current->left != nullptr)
        {
            child = current->left;
        }
        else
        {
            child = current->right;
        }


        // =========================
        // DELETING ROOT
        // =========================

        if (current->parent == nullptr)
        {
            root = child;

            if (child != nullptr)
            {
                child->parent = nullptr;
            }
        }


        // =========================
        // CURRENT IS LEFT CHILD
        // =========================

        else if (current->parent->left == current)
        {
            current->parent->left = child;

            if (child != nullptr)
            {
                child->parent = current->parent;
            }
        }


        // =========================
        // CURRENT IS RIGHT CHILD
        // =========================

        else
        {
            current->parent->right = child;

            if (child != nullptr)
            {
                child->parent = current->parent;
            }
        }

        size--;

        delete current;
    }


    // =========================
    // INORDER TRAVERSAL
    // =========================

    void inorder(Node* current)
    {
        if (current == nullptr)
        {
            return;
        }

        inorder(current->left);

        cout << current->data << " ";

        inorder(current->right);
    }


    // =========================
    // GET ROOT
    // =========================

    Node* getRoot()
    {
        return root;
    }


    // =========================
    // GET SIZE
    // =========================

    int getSize()
    {
        return size;
    }
};


// =========================
// MAIN
// =========================

int main()
{
    BinaryTree tree;


    // INSERT
    tree.insert(90);
    tree.insert(80);
    tree.insert(70);
    tree.insert(60);
    tree.insert(100);
    tree.insert(95);
    tree.insert(110);


    // INORDER
    cout << "Inorder:" << endl;

    tree.inorder(tree.getRoot());

    cout << "\n\n";


    // SEARCH
    cout << "Search 70:" << endl;

    if (tree.search(70) != nullptr)
    {
        cout << "Found" << endl;
    }
    else
    {
        cout << "Not found" << endl;
    }


    // DELETE
    cout << "\nDeleting 90..." << endl;

    tree.deletion(90);


    // AFTER DELETION
    cout << "After deletion:" << endl;

    tree.inorder(tree.getRoot());

    cout << endl;


    return 0;
}
```
