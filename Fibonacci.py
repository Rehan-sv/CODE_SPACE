def fibo(n):
    if n<=1:
        return n
    else:
        return(fibo(n-1))+fibo(n-2)

n=int(input("Enter the numbers/ term: "))
if n<=0:
    print("Enter a +ve number:")
else:
    print("fibonacci seq is:")
    for i in range(n):
        print(fibo(i),end="")
    