def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2

    l1 = arr[:mid]
    l2 = arr[mid:]

    l1 = merge_sort(l1)
    l2 = merge_sort(l2)

    l3 = merge(l1, l2)

    return l3


def merge(l1, l2):
    l3 = []
    i = j = 0

    while i < len(l1) and j < len(l2):
        if l1[i] < l2[j]:
            l3.append(l1[i])
            i += 1
        else:
            l3.append(l2[j])
            j += 1

    while i < len(l1):
        l3.append(l1[i])
        i += 1

    while j < len(l2):
        l3.append(l2[j])
        j += 1

    return l3


arr = list(map(int, input("Enter elements: ").split()))
print("Sorted:", merge_sort(arr))