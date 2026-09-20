#include <iostream>
using namespace std;
    class node{
    private:
    node *parent;
    node *leftchild;
    node *rightchild;
    int data;
    public:
    node(node *parent ,int data,node *leftchild,node *rightchild ){
        this->parent =parent;
        this->leftchild=leftchild;
        this->rightchild=rightchild;
        this->data=data;
    }
    node *getParent(){
        return parent;
    }
    node *getleftchild(){
        return leftchild;
    }
    node* getRightChild() {
			return rightchild;
		}

		int getData() {
			return data;
		}

		void setParent(node* parent) {
			this->parent = parent;
		}

		void setLeftChild(node* leftChild) {
			this->leftchild = leftchild;
		}

		void setRightChild(node* rightChild) {
			this->rightchild = rightchild;
		}

		void setData(int data) {
			this->data = data;
		}

};
class Bst{
    private:
    node *root;
    int size;
    public:
    Bst(){
        this->root=NULL;
        this->size=0;
    }

        int getSize() {
            return size;
        }

        node* getRoot() {
            return root;
        }

        bool isEmpty() {
            return root == NULL;
        }
    void insert(int data){
        if (isEmpty()){
            root=new node(NULL,data,NULL,NULL);
        }
        else{
            
        }
    }

};