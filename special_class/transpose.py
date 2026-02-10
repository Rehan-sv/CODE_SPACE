A = [[1, 2, 3],
     [4, 5, 6]]
rows=len(A)
col=len(A[0])
result=[[0,0],
        [0,0],
        [0,0]]
for i in range(rows):
    for j in range(col):
        result[j][i] = A[i][j]  

print("Transpose:")
for i in result:
    print(i)
