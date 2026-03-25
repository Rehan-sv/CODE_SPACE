def implication(p,q):  
    return not p or q

value=[True,False]
print("p \t q \t p->q")
for p in value:
    for q in value:
        print(f"{p} \t {q} \t {implication(p,q)}")
