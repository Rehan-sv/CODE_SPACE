# --- Helper: find k-th node from end ---
def find_kend(head, k):
    first = head
    second = head

    for i in range(k):
        if first is None:
            return None        # list has fewer than k nodes
        first = first.next

    while first:
        first = first.next
        second = second.next

    return second


# --- Delete k-th node from end (using find_kend) ---
def del_kend(head, k):
    curr = find_kend(head, k + 1)   # node just BEFORE the one to delete

    if curr is None:
        return head.next             # deleting the head node (k == length)

    curr.next = curr.next.next       # bypass the k-th node from end
    return head


# --- Alternative approach (two-pointer, original) ---
def delete_kth_from_end(head, k):

    first = head
    second = head

    # rotating linked list by k places to the right 
    

    
    for i in range(k):
        if first is None:
            return head
        first = first.next


    if first is None:
        return head.next
    
    while first.next:
        first = first.next
        second = second.next


    second.next = second.next.next

    return head

