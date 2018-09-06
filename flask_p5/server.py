# Daniel Shiffman
# Nature of Code: Intelligence and Learning
# https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

# import everything we need
from flask import Flask, jsonify, request, json
from flask_socketio import SocketIO
from flask import send_from_directory


# Setup Flask app.
app = Flask(__name__, static_url_path='/static')
# Extra debugging
app.debug = True

socketio = SocketIO(app, async_handlers=True) # make socketio callbacks run async way

# Routes
# This is root path, use index.html in "static" folder
@app.route('/')
def root():
  print('root!!!')
  return app.send_static_file('index.html')
#   return send_from_directory(app.static_url_path, '/index.html')
#   return send_from_directory('', 'index.html')

# This is a nice way to just serve everything in the "static" folder
@app.route('/<path:path>')
def static_proxy(path):
  print(path)
  # send_static_file will guess the correct MIME type
#   return send_from_directory(app.static_url_path, path)
  return app.send_static_file(path)

## Here is a new route to receive data from p5
@app.route('/test')
def test():
    print('test')
    # Get the "name" value sent from p5
    name = request.args.get('name')

    # If nothing was sent
    if name is None:
        return jsonify(status='no name')

    ## otherwise
    else:
        # Using "jsonify" makes it easy to read the data back in p5
        return jsonify(status='name', name=name)


## Here is a new route to receive data from p5
@app.route('/update/<_col>')
def updatePos(_col):
    print(_col)

    # back_col = request.args.get('color')
    # print(back_col)

    socketio.emit('updateBackground', json.dumps( { 'data' : _col }))

    return json.dumps({'status':'OK'})


# Run app:
if __name__ == '__main__':
    # Localhost and port 8080
    # app.run( host='0.0.0.0', port=20000, debug=True )
    app.run( host='0.0.0.0', debug=True )
    # If you enable debugging, you'll get more info
    # server will restart automatically when code changes, etc.
    # app.run( host='0.0.0.0', port=8080, debug=True )
