def Truth_Table_Not():
    values=[True,False]
    print("p \t ~p ")
    
    for p in values:
        print(f"{p} \t {not p} ")
Truth_Table_Not()

def neg(p):
    return not  p 
values=[True,False]
print("p \t ~p")
for p in values:
        print(f"{p}\t {neg(p)}")