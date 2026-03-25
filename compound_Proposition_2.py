#((p->q)^(q->r))->(p->r)
def conjunction(p, q):
    return p and q

def implication(p, q):
    return (not p) or q

print("p \t q \t r \t p->q \t q->r \t (p->q)^(q->r) \t p->r \t final")

values = [True, False]

for p in values:
    for q in values:
        for r in values:

            a = implication(p, q)
            b = implication(q, r)
            c = conjunction(a, b)
            d = implication(p, r)
            e = implication(c, d)

            print(f"{p} \t {q} \t {r} \t {a} \t {b} \t {c} \t\t {d} \t {e}")
            
