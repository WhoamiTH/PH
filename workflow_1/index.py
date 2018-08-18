# _*_ coding:utf-8 _*_
from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import json

app = Flask(__name__)


@app.route('/')
def index():
    print(123)
    return render_template('index.html')



# @app.route('/exec')
# def exec_code(code,name_output):
#     output = []
#     exec(code)
#     for name in range(num_output):
#         output.append(locals()[name])
#     return jsonify(output)


@app.route('/test/', methods=["POST"])
def test_post():
    print('sadfsdaf')
    # print(request.post_data)
    data = request.get_data()
    data = json.loads(data)
    print(data)
    # print(type(data[l]))
    # print(request)
    # print(request.headers)
    # print(request.form.get(post_data))
#data = request.form
#    print(request.form['l[]'])
#    print(request.form['l[]'])
#    print(request.form['l[]'])
#    dt = json.loads(data)
#    print(dt)
    # return_data = 'success'
    return 'success'





if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=9999)
