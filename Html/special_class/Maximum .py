n=int(input("Enter the number "))
l=[]
for i in range(n):
    a=int(input(f"Enter the number{i+1} "))
    l.append(a)
    max=l[0]
for j in l:
    if j>max:
        max=j
        print("highest",j)
    