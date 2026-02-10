A = [[1, 2, 3],
     [4, 5, 6]]
B = [[7, 8, 9],
     [1, 2, 3],
     [4, 5, 6]]     
result = [[0, 0, 0],
          [0, 0, 0]]
for i in range(len(A)):          
    for j in range(len(A[0])):
        for k in range(len(B)):
            result[i][j]+=A[i][j]*B[i][j]
print(result)