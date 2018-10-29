# Daniel Shiffman
# Nature of Code: Intelligence and Learning
# https://github.com/shiffman/NOC-S17-2-Intelligence-Learning


# import everything we need
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, join_room


import argparse, random, time
from pythonosc import osc_message_builder
from pythonosc import udp_client

# Setup Flask app.
app = Flask(__name__)
# Extra debugging
app.debug = True

# SocketIO
socketio =  SocketIO(app, async_handlers=True)
# socketio =  SocketIO(app, async_mode='eventlet')

# stage labels
GRAPH = -1;
LOGGING_IN = 0;
CATCH_BALL_1 = 1;
CATCH_BALL_2 = 2;
CATCH_BALL_3 = 3;
CATCH_BALL_4 = 4;
CATCH_BALL_ENDDING = 5;
LOGGED_OUT = 6;

# stage holder
stage = LOGGING_IN;

STATUS_NOT_STOPPED = 1;
STATUS_STOPPED = 0;
ENDING_CATCH_BALL_LIMIT = 20;
ENDING_BALL_ID = 5;
SOUND_OFF_ID = 6;

# osc 
parser = argparse.ArgumentParser()
parser.add_argument("--ip", default="127.0.0.1",
    help="The ip of the OSC server")
parser.add_argument("--port", type=int, default=57120,
    help="The port the OSC server is listening on")
args = parser.parse_args()

client = udp_client.SimpleUDPClient(args.ip, args.port)




socketClientList = [];
socketClientListTemp = [];

# 4 balls each has 3 axis
acc_obj = [{}, {}, {}, {}];
ori_obj = [{}, {}, {}, {}];
prev_ori_obj = [{}, {}, {}, {}];

angvel_x_buffer = [[0], [0], [0], [0]];
angvel_y_buffer = [[0], [0], [0], [0]];
angvel_z_buffer = [[0], [0], [0], [0]];

acc_x_buffer = [[0], [0], [0], [0]];
acc_y_buffer = [[0], [0], [0], [0]];
acc_z_buffer = [[0], [0], [0], [0]];

acc_x_prev = [[0], [0], [0], [0]];
acc_y_prev = [[0], [0], [0], [0]];
acc_z_prev = [[0], [0], [0], [0]];

acc_x_cur = [[0], [0], [0], [0]];
acc_y_cur = [[0], [0], [0], [0]];
acc_z_cur = [[0], [0], [0], [0]];

vel_x_prev = [[0], [0], [0], [0]];
vel_y_prev = [[0], [0], [0], [0]];
vel_z_prev = [[0], [0], [0], [0]];

vel_x_cur = [[0], [0], [0], [0]];
vel_y_cur = [[0], [0], [0], [0]];
vel_z_cur = [[0], [0], [0], [0]];

vel_x = [[0], [0], [0], [0]];
vel_y = [[0], [0], [0], [0]];
vel_z = [[0], [0], [0], [0]];

count_x = [[0], [0], [0], [0]];
count_y = [[0], [0], [0], [0]];
count_z = [[0], [0], [0], [0]];

# boolean
isStop = [False, False, False, False];
isRotating = [False, False, False, False];
isFlying = [False, False, False, False];
isPrint_not_stopped = [False, False, False, False];
isPrint_stopped = [False, False, False, False];
hasBallFlown = [False, False, False, False];
CATCH_BALL_2_started = False;

# counter
flyingCount = [0, 0, 0, 0];
socketIdxCnt = 0;
endingCatchBallCount = 0; # will work only on ball_3



# Routes
# This is root path, use index.html in "static" folder
@app.route('/')
def root():

    #osc send test
    # client.send_message("/isBallStopped", random.random())

    return app.send_static_file('index.html')

# This is a nice way to just serve everything in the "static" folder
@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)

## Here is a new route to receive data from p5
@app.route('/test')
def test():
    # Get the "name" value sent from p5
    name = request.args.get('name')
    # If nothing was sent
    if name is None:
        return jsonify(status='no name')
    ## otherwise
    else:
        # Using "jsonify" makes it easy to read the data back in p5
        return jsonify(status='name',
                   name=name)


@socketio.on('connect')
def handle_connection():

    id = request.sid
    print('new connection: ' + id)

    socketClientList.append(id)
    print(socketClientList)

    join_room(id)

    # emit to client that has specific socket id.
    socketio.emit('loggedIn', id, room=id)
    socketio.emit('setStage', {'value': stage}, room=id)


@socketio.on('disconnect')
def handle_disconnetion():

    id = request.sid
    print('Client disconnected: ' + id)

    if id in socketClientList:
        socketClientList.remove(id)

    print(socketClientList)


#@socketio.on('ball_0')
#def handle_ball_0():

#@socketio.on('ball_1')
#def handle_ball_1():

#@socketio.on('ball_2')
#def handle_ball_2():

#@socketio.on('ball_3')
#def handle_ball_3():






# Run app:
if __name__ == '__main__':


    # Localhost and port 8080
    app.run( host='0.0.0.0', port=8080, debug=False)
    # If you enable debugging, you'll get more info
    # server will restart automatically when code changes, etc.
    # app.run( host='0.0.0.0', port=8080, debug=True )



    socketio.run(app)


