# values=[True,False]
# print("p \t q \t p v q")
# for p in values:
#     for q in values:
#         print(f"{p} \t {q} \t {p or q}")
    
# Method 2 :
def truth_table_or():
    values = [True, False]
    print("p  \t  q  \t  p v q")
    
    for p in values:
        for q in values:
            print(f"{p} \t {q} \t {p or q}")

truth_table_or()

def dis(p,q):
    return p or q
values=[True,False]
print("p \t q \t p v q")
for p in values:
    for q in values:
        print(f"{p} \t {q} \t {dis(p,q)}")