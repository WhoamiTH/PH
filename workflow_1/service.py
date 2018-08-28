import pymysql
import numpy as np
import time

def select_from_database(sql):
    db = pymysql.connect("localhost", "root", "123456", "test")
    cursor = db.cursor()
    cursor.execute(sql)
    results = cursor.fetchall()
    db.close()
    results = np.array(results)
    return results

def select_main(sql):
    db = pymysql.connect("localhost", "root", "123456", "precision_health")
    cursor = db.cursor()
    cursor.execute(sql)
    results = cursor.fetchall()
    db.close()
    results = np.array(results)
    return results



def insert_to_database(sql):
	db = pymysql.connect("localhost", "root", "123456", "precision_health")
	cursor = db.cursor()
	cursor.execute(sql)
	db.commit()
	db.close()

def update_to_database(sql):
    db = pymysql.connect("localhost", "root", "123456", "precision_health")
    cursor = db.cursor()
    cursor.execute(sql)
    db.commit()
    db.close()


def check_value_in_database(person_id,date,feature,value):
    select_sql = "SELECT * FROM main WHERE person_id=%d AND feature='%s' ORDER BY time"%(person_id,feature_name)
     



def submit_new_data(data):
	person_id = 1
	date = time.strftime("%d/%m/%Y")

	for i in data:
		feature = i
		value = float(data[i])

		insert_sql ="INSERT INTO main (person_id,time,feature,value) VALUES ('%d', '%s', '%s', '%f')"%(person_id,date,feature,value)
		insert_to_database(insert_sql)



def timeformat(time_list):
    new_list = []
    for i in time_list:
        itemobj = time.strptime(i, "%d/%m/%Y")
        itemtime = time.strftime("%Y-%m-%d", itemobj)
        new_list.append(itemtime)
    return new_list



def findTimeList(data):
    time = data[:,1]
    time = time.tolist()
    return time


def ListToChartData(value_list, time_list):
    target = []
    for item in range(len(value_list)):
        dic = {}
        dic["date"] = time_list[item]
        dic["value"] = value_list[item]
        target.append(dic)
    return target




def chartData(person_id, feature_name):
    '''person_id = 1
    feature_name = "salt"'''
    sql = "SELECT * FROM main WHERE person_id=%d AND feature='%s' ORDER BY time"%(person_id,feature_name)
    results = select_main(sql)
    results = sorted(results, key=lambda item:time.strptime(item[1],"%d/%m/%Y"))
    results = np.array(results)
    value_list = results[:,3]
    value_list = value_list.astype(np.float)
    value_list = value_list.tolist()
    time_list = findTimeList(results)
    time_list = timeformat(time_list)
    thechartdata = ListToChartData(value_list, time_list)
    return thechartdata











def test(data):
    inputlist = data['inputlist']
    code = data['code']
    outputlist = data['outputlist']
    print('---------------------------------------------------------\n\n\n')
    print(inputlist)
    print(code)
    print(outputlist)
    print('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n\n\n\n')
    for item in inputlist:
#       print('---------------------------------------------------------')
#       print(item)
#       print(type(item))
#       print(inputlist[item])
#       print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
        t = ''
        t += item
        t += '= 0'
#print(t)
        exec(t)
        print(item)
        locals()[item] = inputlist[item]
    #     print(locals())
    # print(locals())
    print(code)
    exec(code)
    for i in outputlist:
    	outputlist[i] = locals()[i]
#locals()[item] = inputlist[item]
#Input = inputlist[item]
#s = 'print(Input)'
#exec(s)
    print(outputlist)
    return outputlist
    # print(Input)




if __name__ == "__main__" :
    chartData(1,'haha')
