import pymysql
import numpy as np
import time


def select_from_database(sql, host, user, password, database_name):
    db = pymysql.connect(host, user, password, database_name)
    cursor = db.cursor()
    cursor.execute(sql)
    results = cursor.fetchall()
    db.close()
    results = np.array(results)
    return results



def insert_to_database(sql, host, user, password, database_name):
    db = pymysql.connect(host, user, password, database_name)
    cursor = db.cursor()
    cursor.execute(sql)
    db.commit()
    db.close()

def update_to_database(sql, host, user, password, database_name):
    db = pymysql.connect(host, user, password, database_name)
    cursor = db.cursor()
    cursor.execute(sql)
    db.commit()
    db.close()


def check_value_in_database(person_id, date, feature_name, value, host, user, password, database_name):
    select_sql = "SELECT * FROM main WHERE person_id=%d AND time='%s' AND feature='%s'"%(person_id,date,feature_name)
    result = select_from_database(select_sql, host, user, password, database_name)
    if result.shape[0] > 0:
        return True
    else:
        return False
    



def submit_new_data(data, person_id, host, user, password, database_name):
    date = time.strftime("%d/%m/%Y")
    date = '31/08/2018'
    for i in data:
        feature_name = i
        value = float(data[i])
        if check_value_in_database(person_id, date, feature_name, value, host, user, password, database_name):
            update_sql = "UPDATE main SET value=%f WHERE person_id=%d AND time='%s' AND feature='%s'"%(value,person_id,date,feature_name)
            update_to_database(update_sql, host, user, password, database_name)
        else:
            insert_sql ="INSERT INTO main (person_id,time,feature,value) VALUES ('%d', '%s', '%s', '%f')"%(person_id,date,feature_name,value)
            insert_to_database(insert_sql, host, user, password, database_name)



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




def chartData(person_id, feature_name, host, user, password, database_name):
    sql = "SELECT * FROM main WHERE person_id=%d AND feature='%s' ORDER BY time"%(person_id,feature_name)
    results = select_from_database(sql, host, user, password, database_name)
    results = sorted(results, key=lambda item:time.strptime(item[1],"%d/%m/%Y"))
    results = np.array(results)
    value_list = results[:,3]
    value_list = value_list.astype(np.float)
    value_list = value_list.tolist()
    time_list = findTimeList(results)
    time_list = timeformat(time_list)
    thechartdata = ListToChartData(value_list, time_list)
    return thechartdata



def executeProcess(data):
    inputlist = data['inputlist']
    code = data['code']
    outputlist = data['outputlist']
    for item in inputlist:
        t = ''
        t += item
        t += ' = 0'
        exec(t)
        locals()[item] = inputlist[item]
    exec(code)
    for i in outputlist:
    	outputlist[i] = locals()[i]
    return outputlist




if __name__ == "__main__" :
#   chartData(1,'haha')
#   check_value_in_database(1,'29/08/2018','Diet|salt',1)
    person_id = 1
    date = '28/08/2018'
    feature_name = 'Diet|salt'
    value = 9.0
    host = 'localhost'
    user = 'root'
    password = '123456'
    database_name = 'precision_health'
#    select_sql = "SELECT * FROM main WHERE person_id=%d AND time='%s' AND feature='%s'"%(person_id,date,feature_name)
#    results = select_from_database(select_sql, host, user, password, database_name)
#    print(results)
#    update_sql = "UPDATE main SET value=%f WHERE person_id=%d AND time='%s' AND feature='%s'"%(value,person_id,date,feature_name)
#    print(update_sql)
#    update_to_database(update_sql, host, user, password, database_name)
#    data = {'Diet|salt':3}
#    submit_new_data(data, person_id, host, user, password, database_name)
    result = chartData(person_id, feature_name, host, user, password, database_name)
    print(result)
