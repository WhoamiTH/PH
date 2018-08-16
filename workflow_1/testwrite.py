f = open('test.py')

tem = f.readlines()

code = ""

for t in tem:
    code += t

print(code)
exec(code)

print(l)

ie = dict()

print(locals()[l])
