import numpy as np
import random
import csv
import datetime

def loadData(file_name):
    data = np.loadtxt(file_name, dtype=np.str, delimiter=',', skiprows=1)
    return data

def generate_data(person_id, rows):
    tem_data = [person_id]
    for i in range(rows):
        tem_data.append(random.randint(0,1))
    return tem_data


file_name = "threshold.csv"
instance_num = 100
data = []
threshold = loadData(file_name)
rows = threshold.shape[0]
for person_id in range(1, 1+instance_num):
    data.append(generate_data(person_id, rows))
with open("con_moti.csv","w") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(data)
print("Done")
