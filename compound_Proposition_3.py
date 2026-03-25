# (p ^ q ^ (q->r)) v (p->r)

results=[]

def implication(p, q):
    return (not p) or q

def conjunction(p, q):
    return p and q

def disjunction(p, q):
    return p or q

print("p \t q \t r \t q->r \t p^q \t p^q^(q->r) \t p->r \t (p^q^(q->r))v(p->r)")

values = [True, False]

for p in values:
    for q in values:
        for r in values:
            a = implication(q, r)
            b = conjunction(p, q)
            c = conjunction(b, a)
            d = implication(p, r)
            result = disjunction(c, d)

            print(p, "\t", q, "\t", r, "\t", a, "\t", b, "\t", c, "\t", d, "\t", result)

            results.append(result)   # <-- MUST be here

if all(results):
    print("Tautology")
elif not any(results):
    print("Contradiction")
else:
    print("Contingency")