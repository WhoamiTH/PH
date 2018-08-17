from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


def f1():
    ""


@app.route('/exec')
def exec_code(code,name_output):
    output = []
    exec(code)
    for name in range(num_output):
        output.append(locals()[name])

    return jsonify(output)


@app.route('/test', methods=["POST"])
def test_post():
    print(request)
    # dt = json.loads(data)
    # print(dt)
    return 'success'


@app.route('/data/<uid>')
def data_url(uid):
    # print(uid)
    pos_list, feature_name, person_data, current_state = classification.feature_name(int(uid))
    section_name = classification.init_section()
    # print(pos_list)
    return render_template('current_state.html', uid = uid, pos = pos_list, feature = feature_name, data = person_data, state = current_state, section = section_name)

@app.route('/data/section/', methods=['GET'])
def data_section_url():
    uid = request.args.get('uid')
    section_name = request.args.get('section_name')
    print(section_name)
    # print(type(section_name))
    pos_list, feature_name, person_data, current_state = classification.feature_name(int(uid))
    output_list = classification.section_feature(section_name)
    return render_template('section.html', uid = uid, pos = pos_list, feature = feature_name, data = person_data, state = current_state, feature_name = section_name, output_list = output_list)


@app.route('/chart/', methods = ['GET'])
def chart_url():
    uid = request.args.get('uid')
    item = request.args.get('item')
    # print(uid,item)
    data = classification.specific_data(int(uid),int(item))
    top = 100
    low = 13
    # print(data)
    return render_template('chart.html', data = data, top = top, low = low)





# @app.route('/graph')
# def test_graph():
#     data =

#     return render_template('chart.html', data=data)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
