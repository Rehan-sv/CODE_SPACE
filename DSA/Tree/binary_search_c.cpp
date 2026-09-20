#include<iostream>
using namespace std;
	class Node {
		private:
		   Node* parent;
		   Node* leftChild;
		   Node* rightChild;
		   int data;
        public:
		Node(Node* parent, int data, Node* leftChild, Node* rightChild) {
			this->parent = parent;
			this->data = data;
			this->leftChild = leftChild;
			this->rightChild = rightChild;
		}

		Node* getParent() {
			return parent;
		}

		Node* getLeftChild() {
			return leftChild;
		}

		Node* getRightChild() {
			return rightChild;
		}

		int getData() {
			return data;
		}

		void setParent(Node* parent) {
			this->parent = parent;
		}

		void setLeftChild(Node* leftChild) {
			this->leftChild = leftChild;
		}

		void setRightChild(Node* rightChild) {
			this->rightChild = rightChild;
		}

		void setData(int data) {
			this->data = data;
		}
	};
class BinSearchTree {

 private:
    Node* root;
	int size;
public:
    BinSearchTree() {
		this->root = NULL;
		this->size = 0;
	}

	int getSize() {
		return size;
	}

	Node* getRoot() {
		return root;
	}

	bool isEmpty() {
		return root == NULL;
	}

	void insert(int data) {
		if (isEmpty()) {
			root = new Node(NULL, data, NULL, NULL);
		} else {
			Node* prev = NULL; // Parent
			Node* temp = root; // Empty Spot marker

			// Finding Location for insertion
			while (temp != NULL) {
				prev = temp;
				if (temp->getData() > data) {
					temp = temp->getLeftChild();
				} else {
					temp = temp->getRightChild();
				}
			}

			if (prev->getData() > data) {
				prev->setLeftChild(new Node(prev, data, NULL, NULL));
			} else {
				prev->setRightChild(new Node(prev, data, NULL, NULL));
			}
		}

		size++;
	}

	Node* search(int data) {
		if (isEmpty()) {
			return NULL;
		}

		Node* temp = root;

		while (temp != NULL) {
			if (temp->getData() == data) {
				return temp;
			} else if (temp->getData() > data) {
				temp = temp->getLeftChild();
			} else {
				temp = temp->getRightChild();
			}
		}
        
		return NULL;
	}


	Node* deletion(int data) {

		if (isEmpty()) {
			return NULL;
		}

		Node* temp = search(data);// deleting Node*

		// Case 0: Not found
		if (temp == NULL) {
			return NULL;
		}

		Node* parent = temp->getParent(); // Parent of deleting Node*

		// For 2 children
		if (temp->getLeftChild() != NULL && temp->getRightChild() != NULL) {
			Node* succ = temp->getRightChild();// The least highest successor
			Node* succPrev = temp;// Parent of the successor

			// Finds the successor
			while (succ->getLeftChild() != NULL) {
				succPrev = succ;
				succ = succ->getLeftChild();
			}

			temp->setData(succ->getData());// The value we need to delete gets the successors's data
			temp = succ;// Now deleting Node* becomes the successor
			parent = succPrev;// Parent becomes successors parents
		}

		// For 1 and 0 children
		// Always removing the successor in 2 children
		Node* child;

		if (temp->getLeftChild() != NULL) {
			child = temp->getLeftChild();
		} else {
			child = temp->getRightChild();
		}

		if (parent == NULL) {
			root = child;
		} else if (parent->getLeftChild() == temp) {
			parent->setLeftChild(child);
		} else {
			parent->setRightChild(child);
		}

		if (child != NULL) {
			child->setParent(parent);
		}

		temp->setParent(NULL);
		temp->setRightChild(NULL);
		temp->setLeftChild(NULL);
		size--;
		return temp;

	}

	int depth(Node* v) { // O(n)
		if (v->getParent() == NULL) {
			return 0;
		} else {
			return 1 + depth(v->getParent());
		}

		/*
		 * Method 2
		 * if (v == NULL) {
		 * return -1;
		 * } else {
		 * return 1 + depth(v->getParent()); // Returns -1 for empty tree, Returns 0 for
		 * a tree with single Node*
		 * }
		 */
	}

	int depth(Node* r, int x) {
		if (r == NULL) {
			return -1;
		} else {
			int dist = -1;
			if (r->getData() == x || (dist = depth(r->getLeftChild(), x)) >= 0
					|| (dist = depth(r->getRightChild(), x)) >= 0) {
				return dist + 1;
			}

			return dist;
		}
	}

	int height(Node* r) {
		if (r == NULL) {
			return -1;
		} 
		else {
			int le = height(r->getLeftChild());
			int ri = height(r->getRightChild());

			return std::max(le, ri) + 1;
		}
	}

	void preorder(Node* v) {
		if (v == NULL)
			return;
		else {
			cout<<v->getData()<<" ";
			preorder(v->getLeftChild());
			preorder(v->getRightChild());
		}
	}

	void inorder(Node* v) {
		if (v == NULL) {
			return;
		} else {
			inorder(v->getLeftChild());
			cout<<v->getData()<<" ";
			inorder(v->getRightChild());
		}
	}

	 void postorder(Node* v) {
		if (v == NULL) {
			return;
		} else {
			postorder(v->getLeftChild());
			postorder(v->getRightChild());
			cout<<v->getData()<<" ";
		}
	}


};
int main()
{
	BinSearchTree tree;

    tree.insert(50);
    tree.insert(30);
    tree.insert(70);
    tree.insert(20);
    tree.insert(40);
    tree.insert(60);
    tree.insert(80);

    cout << "Size: " << tree.getSize() << endl;

    cout << "Preorder: ";
    tree.preorder(tree.getRoot());
    cout << endl;

    cout << "Inorder: ";
    tree.inorder(tree.getRoot());
    cout << endl;

    cout << "Postorder: ";
    tree.postorder(tree.getRoot());
    cout << endl;

    // Search
    Node* result = tree.search(40);

    if (result != NULL) {
        cout << "40 found" << endl;
        cout << "Depth of 40: "
             << tree.depth(result) << endl;
    }
    else {
        cout << "40 not found" << endl;
    }

    // Height
    cout << "Height: "
         << tree.height(tree.getRoot()) << endl;

    // Delete
    Node* deleted = tree.deletion(30);

    if (deleted != NULL) {
        cout << "Deleted: "
             << deleted->getData() << endl;

        delete deleted;
    }

    cout << "Inorder after deletion: ";
    tree.inorder(tree.getRoot());
    cout << endl;

    return 0;
}