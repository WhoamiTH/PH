# import csv
#
#
# def f3(element):
#     element += 100
#
# def f2(row):
#     for i in row:
#         f3(i)
#
#
# def f1(data):
#     for i in data:
#         f2(i)
#
#
# l = []
# for i in range(10):
#     l.append([x for x in range(10)])
#
# f1(l)
#
# with open("test.csv","w") as csvfile:
#     writer = csv.writer(csvfile)
#     writer.writerows(l)
#

def handle(ls):
    ls[2]= 100
    print(ls)
    return ls


l = [i for i in range(10)]
print(l)
handle(l)
print(l)
