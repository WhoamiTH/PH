import numpy as np
import random
import csv

def loadData(file_name):
    tem = np.loadtxt(file_name, dtype=np.str, delimiter=',', skiprows=1)
    tem_data = tem[:, 1:]
    data = tem_data.astype(np.float)
    return data

def generate_data(threshold):
    tem_data = []
    for i in threshold:
        tem = 0
        if i[1] == 0:
            tem = random.randint(0,1)
            par = random.uniform(1,10)
            if tem != 0:
                tem *= par
        elif i[1] == -1:
            tem = random.random()
            par = random.uniform(0,100)
            tem *= par
        elif i[1] == 1:
            tem = random.randint(0,1)
        elif i[1] == 10:
            tem = random.uniform(0,10)
        else:
            tem = random.uniform(0,i[1])
            par = random.uniform(0,10)
            tem *= par
        tem_data.append(tem)
    return tem_data


file_name = "threshold.csv"
instance_num = 100
data = []
threshold = loadData(file_name)
for i in range(instance_num):
    data.append(generate_data(threshold))
with open("data.csv","w") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(data)
print("Done")
