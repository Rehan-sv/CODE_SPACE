def merge(left, right):

    result = []

    i = 0
    j = 0

    while i < len(left) and j < len(right):

        if left[i]["value"] <= right[j]["value"]:

            result.append(left[i])
            i += 1

        else:

            result.append(right[j])
            j += 1

    while i < len(left):

        result.append(left[i])
        i += 1

    while j < len(right):

        result.append(right[j])
        j += 1

    return result


def merge_sort(arr):

    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2

    left = merge_sort(arr[:mid])

    right = merge_sort(arr[mid:])

    return merge(left, right)


orders = [
    {"id": "ORD1", "value": 2500},
    {"id": "ORD2", "value": 900},
    {"id": "ORD3", "value": 4000}
]

orders = merge_sort(orders)

print(orders)