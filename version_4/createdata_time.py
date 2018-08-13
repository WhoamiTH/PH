import numpy as np
import random
import csv
import datetime

def loadData(file_name):
    tem = np.loadtxt(file_name, dtype=np.str, delimiter=',', skiprows=1)
    tem_data = tem[:, 1:]
    data = tem_data.astype(np.float)
    return data


def generate_date(start, offset, format="%Y-%m-%d"):
    strptime, strftime = datetime.datetime.strptime, datetime.datetime.strftime
    return strftime(strptime(start, format) + datetime.timedelta(offset), format)

def generate_data(person_id, start, offset, threshold):
    tem_data = [person_id]
    tem_data.append(generate_date(start, offset))
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
start = "2018-01-01"
instance_num = 100
time_num = 100
data = []
threshold = loadData(file_name)
for person_id in range(1, 1+instance_num):
    for offset in range(time_num):
        data.append(generate_data(person_id, start, offset, threshold))
with open("data.csv","w") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(data)
print("Done")
