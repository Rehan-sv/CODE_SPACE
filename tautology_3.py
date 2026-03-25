# (p->q) ^ (p ^ ~q)

values=[True,False]
results=[]

def implies(p,q):
    return (not p) or q

def and_(p,q):
    return p and q

print("p \t q \t ~q \t Result")

for p in values:
    for q in values:
        a = implies(p,q)
        b = not q
        c = and_(p,b)
        result = a and c

        results.append(result)

        print(f"{p} \t {q} \t {b} \t {result}")


if all(results):
    print("Tautology")
elif not any(results):
    print("Contradiction")
else:
    print("Contingency")