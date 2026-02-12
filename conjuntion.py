def truth_table_or():
    values = [True, False]
    print("p  \t  q  \t  p and q")
    
    for p in values:
        for q in values:
            print(f"{p} \t {q} \t {p and q}")

truth_table_or()


def dis(p,q):
    return p and q
values=[True,False]
print("p \t q \t p and q")
for p in values:
    for q in values:
        print(f"{p} \t {q} \t {dis(p,q)}")