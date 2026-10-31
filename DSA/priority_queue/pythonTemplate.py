import sys

class Patient:
    def __init__(self, patient_id: int, name: str, priority: int):
        # TODO: Initialize patient attributes (id, name, priority)
        self.id=patient_id
        self.name=name 
        self.priority=priority
        pass

    def __str__(self) -> str:
        # TODO: Return a space-separated string: "id name priority"
        return f"{self.id} {self.name} {self.priority}"
    

class BSTNode:
    def __init__(self, patient: Patient):
        # TODO: Initialize node with patient reference, left child, and right child
        self.patient=patient
        self.right=None
        self.left=None
        pass


class BST:
    def __init__(self):
        # TODO: Initialize empty BST with root as None
        self.root=None
        pass

    def insert(self, patient: Patient) -> None:
        # TODO: Insert patient into BST ordered by patient.id
        if self.root is None:
            self.root=BSTNode(patient)
            return
        current=self.root
        if patient.id < current.patient.id:
            if current.left is None:
                current.left=BST(patient)
                return
            current=current.left 
        elif patient.id>current.patient.id:
            if current.right is None:
                current.right=BSTNode(patient)
                return
            current=current.right
        else:
            current.patient=patient
            return
        pass

    def find(self, patient_id: int) -> Patient | None:
        # TODO: Search for and return patient with matching id (return None if not found)
        current=self.root
        while current is not None:
            if patient_id==current.patient.id:
                return current.patient
            elif patient_id<current.patient.id:
                return current.left
            else:
                return current.right
        return None

    def delete(self, patient_id: int) -> None:
        # TODO: Delete node with matching id, maintaining BST properties for 0, 1, or 2 children
        current=self.root
        while current is not None:
            if patient_id==current.patient.id:
                .
        pass

    def display(self) -> None:
        # TODO: Perform non-recursive/iterative inorder traversal using a  stack and print patients using print(patient)
        pass


class MinHeap:
    def __init__(self, capacity: int):
        # TODO: Allocate 1-indexed heap list and set size to 0
        pass

    def _comes_before(self, a: Patient, b: Patient) -> bool:
        # TODO: Return True if 'a' has higher priority than 'b'
        # Tie-breaker: smaller priority number comes first; if equal, smaller ID comes first
        return False

    def insert(self, patient: Patient) -> None:
        # TODO: Insert patient at end of heap and heapify up
        pass

    def find_position(self, patient_id: int) -> int:
        # TODO: Linear search heap array for patient ID and return 1-based index (or -1 if not found)
        return -1

    def change_priority(self, patient_id: int, new_priority: int) -> None:
        # TODO: Update priority for given patient ID, then heapify up and down to restore heap property
        pass

    def remove_min(self) -> Patient | None:
        # TODO: Extract root patient, replace with last element, heapify down, and return removed patient
        return None


class SmartPatientQueue:
    def __init__(self, capacity: int):
        # TODO:  
        pass

    def register_patient(self, patient_id: int, name: str, priority: int) -> None:
        # TODO:  
        pass

    def find_patient(self, patient_id: int) -> Patient | None:
        # TODO:  
        return None

    def change_priority(self, patient_id: int, new_priority: int) -> Patient | None:
        # TODO:  
        return None

    def attend_next_patient(self) -> Patient | None:
        # TODO:  
        return None

    def display_patients(self) -> None:
        # TODO:  
        pass                



'''
 # ================================================================
 # NOTE
 #  1. Do not have any additional headers other than what is given in the code template
 #  2. DO NOT MODIFY THE MAIN FUNCTION. It automatically handles all the input & output operations 
 #  3. Write your test cases after the main block in the space provided
 # ================================================================
'''

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return

    iterator = iter(input_data)
    n = int(next(iterator))

    queue = SmartPatientQueue(n)

    for _ in range(n):
        operation = next(iterator)

        if operation == "RP":
            patient_id = int(next(iterator))
            name = next(iterator)
            priority = int(next(iterator))
            queue.register_patient(patient_id, name, priority)

        elif operation == "FP":
            patient_id = int(next(iterator))
            patient = queue.find_patient(patient_id)
            if patient is None:
                print(f"Patient {patient_id} not found")
            else:
                print(patient)

        elif operation == "CP":
            patient_id = int(next(iterator))
            new_priority = int(next(iterator))
            patient = queue.change_priority(patient_id, new_priority)
            if patient is not None:
                print(f"Priority Changed: {patient}")

        elif operation == "ANP":
            patient = queue.attend_next_patient()
            if patient is not None:
                print(f"Next Patient: {patient}")

        elif operation == "D":
            queue.display_patients()


if __name__ == "__main__":
    main()        




'''
 # ================================================================
 #  TEST CASES SAMPLE START 
 # ================================================================
'''


#  ENTER ALL THE TEST CASES BETWEEN THE START AND END BLOCKS
#  IN THE FORM OF CODE OMMENTS


'''
 # ================================================================
 #  TEST CASES SAMPLE END 
 # ================================================================
'''    