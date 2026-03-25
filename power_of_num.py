def power(base,exponent):
    if exponent ==0:
        return 1
    elif exponent >0:
        return base*power(base,exponent-1)
    else:
        return 1/power(base,-exponent)

base =int(input("Enter the number : "))
exponent=int(input("Enter the exponent : "))
print("Result",power(base,exponent))

    