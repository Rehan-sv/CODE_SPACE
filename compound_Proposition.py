def disjunction(p,q):
    return p or q 
def conjunction(p,q):
    return p and q
def implification(p,q):
    return not p or q
print("p \t q \t ~q \t pv~q \t p^q \t (pv~q)=> p^q")
values=[True,False]
for p in values:
    for q in values:
        a= not q
        b=disjunction(p,a)
        c=conjunction(p,q)
        d=implification(b,c)
        print(f"{p} \t {q} \t {a} \t {b} \t {c} \t {d} ")