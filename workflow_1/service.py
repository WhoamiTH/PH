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

def insert_to_database(sql):
	db = pymysql.connect("localhost", "root", "123456", "test")
	cursor = db.cursor()
	t = cursor.execute(sql)
	# print(sql)
	# print(t)
	db.commit()
	db.close()




def submit_new_data(data):
	person_id = 1
	date = time.strftime("%d/%m/%Y")

	for i in data:
		feature = i
		value = float(data[i])

		insert_sql ="INSERT INTO main (person_id,time,feature,value) VALUES ('%d', '%s', '%s', '%f')"%(person_id,date,feature,value)
		insert_to_database(insert_sql)

