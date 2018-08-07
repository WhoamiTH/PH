# import pymysql

# db = pymysql.connect("localhost", "root", "123456", "precision_health")

# cursor = db.cursor()

# cursor.execute("DROP TABLE IF EXISTS EMPLOYEE")

# # sql_food = """
# # CREATE TABLE food_content_and_nutrition (
# # code INT NOT NULL,
# # person_id INT NOT NULL
# # )
# # """

# # cursor.execute(sql_food)

# Code = [1,2,3]
# Person_id = [4,5,6]

# for i in range(3):
# 	code = Code[i]
# 	person_id = Person_id[i]
# 	sql_insert = "INSERT INTO food_content_and_nutrition (code,\
# 	person_id) VALUES ({0}, {1})".format(code,\
# person_id)
# 	cursor.execute(sql_insert)
# db.commit()


# db.close()





import pymysql
import numpy as np
 
# 打开数据库连接
db = pymysql.connect("localhost", "root", "123456", "precision_health")
 
# 使用cursor()方法获取操作游标 
cursor = db.cursor()
 
# SQL 查询语句
sql = "SELECT * FROM threshold"
# 执行SQL语句
cursor.execute(sql)
# 获取所有记录列表
results = cursor.fetchall()
print(type(results))
print(results[0])
r = np.array(results)
print(type(r))
print(type(r[0]))
# r = [list(item) for item in results]
# print(type(r))
# print(r[0])
# 关闭数据库连接
db.close()