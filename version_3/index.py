from flask import Flask
from flask import render_template
from flask import request

import Test

app = Flask(__name__)

@app.route('/hello/')
def hello(name=None):
    name = Test.test()
    return render_template('index.html', name=name)

@app.route('/test/<uid>')
def test_url(uid):
    print(uid)
    # arg = request.args.get("param")
    # return "Oh! " + arg
    return "Oh!" + uid


@app.route('/graph')
def test_graph():
    data =

    return render_template('chart.html', data=data)

if __name__ == '__main__':
    app.debug = True
    app.run()