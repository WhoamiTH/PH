from flask import Flask
from flask import render_template
from flask import request
import classification

import Test

app = Flask(__name__)


@app.route('/')
def index():
    id_list = classification.id_list()
    return render_template('index.html', name = id_list)







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
    feature_name = request.args.get('feature_name')
    pos_list, feature_name, person_data, current_state = classification.feature_name(int(uid))
    output_list = classification.section_feature(feature_name)
    return render_template('section.html', uid = uid, pos = pos_list, feature = feature_name, data = person_data, state = current_state, feature_name = feature_name, output_list = output_list)


@app.route('/chart/', methods = ['GET'])
def chart_url():
    uid = request.args.get('uid')
    item = request.args.get('item')
    print(uid,item)
    data = classification.specific_data(int(uid),int(item))
    # print(data)
    return render_template('chart.html', data = data)





# @app.route('/graph')
# def test_graph():
#     data =

#     return render_template('chart.html', data=data)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
