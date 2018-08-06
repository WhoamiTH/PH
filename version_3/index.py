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
    print(uid)
    pos_list, feature_name, person_data, current_state = classification.feature_name(int(uid))
    # arg = request.args.get("param")
    # return "Oh! " + arg
    print(pos_list)
    return render_template('current_state.html', uid = uid, pos = pos_list, feature = feature_name, data = person_data, state = current_state)



@app.route('/chart/', methods = ['GET'])
def chart_url():
    uid = request.args.get('uid')
    item = request.args.get('item')
    data = classification.specific_data(uid, item)
    return render_template('chart.html', data = data)





# @app.route('/graph')
# def test_graph():
#     data =

#     return render_template('chart.html', data=data)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)