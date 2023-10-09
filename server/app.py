from flask import Flask, request, Response
from flask_cors import CORS
import base64
import cv2
import json
from flask import Flask
import cv2
import base64
from ultralytics import YOLO
import finder
import receiver
app = Flask(__name__)
CORS(app) 
model = YOLO("./best.pt")
close_flag = False
video_path = ''

def generate_ndi():
    find = finder.create_ndi_finder()
    NDIsources = find.get_sources()
    recieveSource = None; 

    if(len(NDIsources) > 0):
        print(str(len(NDIsources)) + " NDI Sources Detected")
        for x in range(len(NDIsources)):
            print(str(x) + ". "+NDIsources[x].name + " @ "+str(NDIsources[x].address))
        if(len(NDIsources) == 1):
            recieveSource = NDIsources[0]
            print("Automatically Connecting To Source...")
        else:
            awaitUserInput = True
            while(awaitUserInput):
                print("")
                try:
                    key = int(input("Please choose a NDI Source Number to connect to:"))
                    if(key < len(NDIsources) and key >= 0):
                        awaitUserInput = False
                        recieveSource = NDIsources[key]
                    else:
                        print("Input Not A Number OR Number not in NDI Range. Please pick a number between 0 and "+ str(len(NDIsources)-1))		
                except:
                    print("Input Not A Number OR Number not in NDI Range. Please pick a number between 0 and "+ str(len(NDIsources)-1))
                    
    else:
        print("No NDI Sources Detected - Please Try Again")

    reciever = receiver.create_receiver(recieveSource)

    while(1):
        if close_flag:
            break
        frame = reciever.read()
        frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)
        results = model.track(frame, persist=True)
        data = ''
        if results[0].boxes.id is not None:
            ids = results[0].boxes.id.cpu().numpy().astype(int)
            boxes = results[0].boxes.xyxyn.cpu().numpy()
            for box, id in zip(boxes, ids):
                item = ', '.join(map(str, box))+ ", " + str(id) +"\n"
                data += item
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        # Combine frame and data into a single dictionary
        frame_data = {
            'frame': base64.b64encode(frame_bytes).decode('utf-8'), # Encode frame as base64
            'data': data,
        }
        frame_data_json = json.dumps(frame_data)

        yield f"data:{frame_data_json}\n\n"  # Send data as EventSource stream

def generate_frame_and_data():
    global close_flag, video_path
    cap = cv2.VideoCapture(video_path)
    index = 0
    while True:
        success, frame = cap.read()
        if (not success) or (close_flag==True):
            break
        frame = cv2.resize(frame, (1000, 800))
        if index % 1 ==0:
            results = model.track(frame, persist=True)
            data = ''
            if results[0].boxes.id is not None:
                ids = results[0].boxes.id.cpu().numpy().astype(int)
                boxes = results[0].boxes.xyxyn.cpu().numpy()
                for box, id in zip(boxes, ids):
                    item = ', '.join(map(str, box))+ ", " + str(id) +"\n"
                    data += item
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            # Combine frame and data into a single dictionary
            frame_data = {
                'frame': base64.b64encode(frame_bytes).decode('utf-8'), # Encode frame as base64
                'data': data,
            }

            # Serialize the frame_data dictionary to JSON
            frame_data_json = json.dumps(frame_data)

            yield f"data:{frame_data_json}\n\n"  # Send data as EventSource stream
        index += 1

@app.route('/upload', methods=['POST'])
def upload():
    global video_path, close_flag
    close_flag = True
    video_path = "videos/" + request.form['video']
    print("dddddddd", video_path)
    return "success"

@app.route('/video')
def video():
    global close_flag
    close_flag = False
    return Response(generate_frame_and_data(), mimetype='text/event-stream')

@app.route('/ndi')
def ndi():
    global close_flag
    close_flag = False
    return Response(generate_ndi(), mimetype='text/event-stream')

@app.route('/close')
def close():
    global close_flag
    close_flag = True
    return "closed"

if __name__ == '__main__':
    app.run()
