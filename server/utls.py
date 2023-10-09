from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import base64
from flask_socketio import SocketIO
import cv2
import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
# @socketio.on('connect', namespace='/camera')
# def camera_connect():
    # cap = cv2.VideoCapture(r'E:\adam\web\client\public\videos\2.mp4')
    # while True:
    #     ret, frame = cap.read()
    #     if not ret:
    #         break
#         # Encode the frame as JPEG
#         _, buffer = cv2.imencode('.jpg', frame)
#         jpeg_data = buffer.tobytes()
#         socketio.emit('frame', jpeg_data, namespace='/camera')

# if __name__ == '__main__':
#     socketio.run(app)
def generate_frame_and_data(camera):
    while True:
        success, frame = camera.read()
        h, w = frame.shape[:2]
        if success:
            src = frame.copy()

            # Process your frame and gather additional data
            # Replace this with your own data gathering logic
            additional_data = {
                'frame_shape': (h, w),
                'example_data': 'Your additional data here',
                # Add more data as needed
            }

            ret, buffer = cv2.imencode('.jpg', src)
            frame = buffer.tobytes()

            # Combine frame and data into a single dictionary
            frame_data = {
                # 'frame': base64.b64encode(frame).decode('utf-8'),
                'data': additional_data,
            }

            # Serialize the frame_data dictionary to JSON and encode it as bytes manually
            frame_data_json = json.dumps(frame_data)
            frame_data_bytes = frame_data_json.encode('utf-8')

            yield frame_data_bytes

@app.route('/upload', methods=['POST'])
def upload_video():
    try:
        # Get the uploaded video file
        uploaded_video = request.files['video']
        
        if uploaded_video:
            # Save the video file to a temporary location
            video_path = "temp_video.mp4"  # You can customize the path as needed
            uploaded_video.save(video_path)
            
            # Process the video using OpenCV (e.g., resize or apply some filters)
            cap = cv2.VideoCapture(video_path)
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                cv2.imshow("d", frame)
                cv2.waitKey(1)

            cap.release()
            
            # You can return a response to the client with the processed video or results
            return jsonify({"message": "Video processed successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run()
