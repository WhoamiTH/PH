# _*_ coding:utf-8 _*_
from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import json
import time
import service

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/down_left_bottom_submit/', methods=["POST"])
def down_left_bottom_submit_button():
    data = request.get_data()
    data = json.loads(data)
    service.submit_new_data(data)
    return 'success'

@app.route('/chartpart/', methods=["POST"])
def drawChart():
    data = request.get_data()
    data = json.loads(data)
    person_id = data['id']
    feature_name = data['name']
    position_name = data['position_name']
    thechartdata = service.chartData(person_id, feature_name)
    resultdata = {}
    resultdata['data'] = thechartdata
    resultdata['position_name'] = position_name
    resultdata = json.dumps(resultdata)
    return resultdata

@app.route('/run/', methods=["POST"])
def run_workflow():
    data = request.get_data()
    data = json.loads(data)
    # print(data)
    outputlist = service.executeProcess(data)
    outputlist = json.dumps(outputlist)
    return outputlist

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
