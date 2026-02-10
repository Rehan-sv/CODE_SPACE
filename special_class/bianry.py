n = 4
for i in range(n):
    start = i % 2     # 0 or 1
    for j in range(i + 1):
        print((start + j) % 2, end=" ")
    print()