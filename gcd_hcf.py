def hcf(max, min):
    if min == 0:
        return max
    else:
        return hcf(min, max % min)

a = int(input("Enter 1st num: "))
b = int(input("Enter the 2nd num: "))

if a > b:
    max = a
    min = b
else:
    max = b
    min = a
    
print("The gcd of", a, "and", b, "is:", hcf(max, min))
