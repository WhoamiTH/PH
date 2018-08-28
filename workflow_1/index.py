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



# @app.route('/exec')
# def exec_code(code,name_output):
#     output = []
#     exec(code)
#     for name in range(num_output):
#         output.append(locals()[name])
#     return jsonify(output)


@app.route('/down_left_bottom_submit/', methods=["POST"])
def down_left_bottom_submit_button():
    data = request.get_data()
    data = json.loads(data)
    print(data)
    service.submit_new_data(data)
    return 'success'



@app.route('/chartpart/', methods=["POST"])
def drawChart():
    print('hahaha')
    data = request.get_data()
    data = json.loads(data)
    print(data)
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
    print('haha')
    data = request.get_data()
    data = json.loads(data)
    print(data)

    # inputlist = data['inputlist']
    # code = data['code']
    # outputlist = data['outputlist']

    # print(inputlist)
    # print(type(inputlist))
    # for item in inputlist:
    #     print('---------------------------------------------------------')
    #     print(item)
    #     print(type(item))
    #     print(inputlist[item])
    #     print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    #     t = ''
    #     t += item
    #     t += '= 0'
    #     print(t)
    #     exec(t)
    #     locals()[item] = inputlist[item]
    #     print(Input)
    outputlist = service.test(data)
    outputlist = json.dumps(outputlist)
    #     locals()[item] = inputlist[item]
    # print(Input)

    # for i in data:
    #     print(i)
    #     print(data[i])
    #     print(type(data[i]))

        # locals()[i] = data[i]
        # exec(data)
    # print('---------------------------------------------------------')
    # print(data['inputlist'])
    # print(type(data['inputlist']))
    # print('++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    # # code = data['code']
    # exec(code)
    # for i in outputlist:
    #     outputlist[i] = locals()[i]
    # print(outputlist)
    return outputlist






if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
