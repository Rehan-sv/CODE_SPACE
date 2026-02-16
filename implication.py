def implication(p,q):
    return ( not p or q)
values=[True,False]
print("p \t q \t p => q")
for p in values:
    for q in values:
        print(f"{p} \t {q} \t {implication(p,q)}")