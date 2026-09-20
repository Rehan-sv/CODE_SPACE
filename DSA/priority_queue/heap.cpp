#include <iostream>
#include <string>
using namespace std;

// =====================================================
// HEAP ADT
// =====================================================

struct Patient
{
    string id;
    int severity;
};

class MaxHeap
{
private:
    static const int MAX_SIZE = 100;

    Patient heap[MAX_SIZE];
    int heapSize;

    int parent(int i)
    {
        return (i - 1) / 2;
    }

    int leftChild(int i)
    {
        return 2 * i + 1;
    }

    int rightChild(int i)
    {
        return 2 * i + 2;
    }

    void swapPatients(Patient &a, Patient &b)
    {
        Patient temp = a;
        a = b;
        b = temp;
    }

    void heapifyUp(int index)
    {
        while (index > 0 &&
               heap[parent(index)].severity < heap[index].severity)
        {
            swapPatients(heap[parent(index)], heap[index]);
            index = parent(index);
        }
    }

    void heapifyDown(int index)
    {
        while (true)
        {
            int left = leftChild(index);
            int right = rightChild(index);
            int largest = index;

            if (left < heapSize &&
                heap[left].severity > heap[largest].severity)
            {
                largest = left;
            }

            if (right < heapSize &&
                heap[right].severity > heap[largest].severity)
            {
                largest = right;
            }

            if (largest == index)
                break;

            swapPatients(heap[index], heap[largest]);
            index = largest;
        }
    }

    int findPatient(string id)
    {
        for (int i = 0; i < heapSize; i++)
        {
            if (heap[i].id == id)
                return i;
        }

        return -1;
    }

public:

    MaxHeap()
    {
        heapSize = 0;
    }

    bool isEmpty()
    {
        return heapSize == 0;
    }

    bool isFull()
    {
        return heapSize == MAX_SIZE;
    }

    void insertPatient(string id, int severity)
    {
        if (isFull())
        {
            cout << "Waiting list is full.\n";
            return;
        }

        Patient newPatient;

        newPatient.id = id;
        newPatient.severity = severity;

        heap[heapSize] = newPatient;
        heapSize++;

        heapifyUp(heapSize - 1);
    }

    Patient peek()
    {
        if (isEmpty())
            return {"", -1};

        return heap[0];
    }

    Patient treatNextPatient()
    {
        if (isEmpty())
            return {"", -1};

        Patient patient = heap[0];

        heap[0] = heap[heapSize - 1];
        heapSize--;

        if (!isEmpty())
            heapifyDown(0);

        return patient;
    }

    void updateSeverity(string id, int newSeverity)
    {
        int index = findPatient(id);

        if (index == -1)
        {
            cout << "Patient not found.\n";
            return;
        }

        int oldSeverity = heap[index].severity;

        heap[index].severity = newSeverity;

        if (newSeverity > oldSeverity)
            heapifyUp(index);

        else if (newSeverity < oldSeverity)
            heapifyDown(index);
    }

    void display()
    {
        if (isEmpty())
        {
            cout << "Waiting list is empty.\n";
            return;
        }

        cout << "Current Heap: ";

        for (int i = 0; i < heapSize; i++)
        {
            cout << "("
                 << heap[i].id
                 << ", "
                 << heap[i].severity
                 << ") ";
        }

        cout << endl;
    }
};

// =====================================================
// HOSPITAL APPLICATION
// =====================================================

int main()
{
    MaxHeap waitingList;

    waitingList.insertPatient("P101", 45);
    waitingList.display();

    waitingList.insertPatient("P102", 80);
    waitingList.display();

    waitingList.insertPatient("P103", 60);
    waitingList.display();

    waitingList.insertPatient("P104", 35);
    waitingList.display();

    Patient next = waitingList.peek();

    cout << "\nNext patient: "
         << next.id
         << " (Severity: "
         << next.severity
         << ")\n";

    Patient treated = waitingList.treatNextPatient();

    cout << "\nTreated patient: "
         << treated.id
         << " (Severity: "
         << treated.severity
         << ")\n";

    waitingList.display();

    waitingList.insertPatient("P105", 75);
    waitingList.display();

    cout << "\nUpdating P104 severity from 35 to 90\n";

    waitingList.updateSeverity("P104", 90);

    waitingList.display();

    treated = waitingList.treatNextPatient();

    cout << "\nTreated patient: "
         << treated.id
         << " (Severity: "
         << treated.severity
         << ")\n";

    waitingList.display();

    return 0;
}