# _*_ coding:utf-8 _*_
from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import json
import time
import service
import sys

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/down_left_bottom_submit/', methods=["POST"])
def down_left_bottom_submit_button():
    data = request.get_data()
    data = json.loads(data)
    service.submit_new_data(data, username, host, user, password, database_name)
    return 'success'

@app.route('/chartpart/', methods=["POST"])
def drawChart():
    data = request.get_data()
    data = json.loads(data)
    username = str(data['id'])
    feature_name = data['name']
    position_name = data['position_name']
    thechartdata = service.chartData(username, feature_name, host, user, password, database_name)
    resultdata = {}
    resultdata['data'] = thechartdata
    resultdata['position_name'] = position_name
    resultdata = json.dumps(resultdata)
    return resultdata

@app.route('/run/', methods=["POST"])
def run_workflow():
    data = request.get_data()
    data = json.loads(data)
    print(data)
    outputlist = service.executeProcess(data)
    outputlist = json.dumps(outputlist)
    return outputlist

if __name__ == '__main__':
    host = 'localhost'
    user = 'root'
    password = '123456'
    database_name = 'precision_health'
    username = '1'

    argv = sys.argv[1:]
    for each in argv:
        para = each.split('=')
        if para[0] == 'host':
            host = para[1]
        if para[0] == 'user':
            user = para[1]
        if para[0] == 'password':
            password = para[1]
        if para[0] == 'database_name':
            database_name = para[1]
        if para[0] == 'username':
            username = para[1]
    print('host: ' + host)
    print('user: ' + user)
    print('password: ' + password)
    print('database_name: ' + database_name)
    print('username: ' + username)

    app.debug = True
    app.run(host='127.0.0.1', port=5000)

