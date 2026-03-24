#(p->q) ^ (p->r)
values=[True,False]
results=[]
def implies(p,q):
    return (not p )or  q
print("p \t q \t r \t Result")

for p in values:
    for q in values:
        for r in values:
            a=implies(p,q)
            b=implies(p,r)
            result=a and b
            results.append(result)
            print(f"{p} \t {q} \t {r} \t {result}")
print("conclusion")
if all(results):
    print("It is tautology")
elif not any(results):
    print ("its contradiction")
else:
    print("It is a contigency")
