def biconditional(p, q):
    return (p == q)   # or: return (p and q) or (not p and not q)

values = [True, False]
print("p \t q \t p <=> q")

for p in values:
    for q in values:
        print(f"{p} \t {q} \t {biconditional(p, q)}")
