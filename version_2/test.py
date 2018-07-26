import numpy as np

t = np.zeros(100).reshape(50,2)
print(t)
d = []
for i in range(5):
    h = (i+1)*10
    d.append(t[i:h,:])
print(type(d[0]))
print(d[0][0])