import cv2
from ultralytics import YOLO
import numpy as np
model = YOLO("./best.pt")
cap = cv2.VideoCapture("2.mp4")
index = 0
# results = model.track(source="2.mp4", show=True) 
while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model.track(frame, persist=True)
    if results[0].boxes.id is not None:
        res = ""
        ids = results[0].boxes.id.cpu().numpy().astype(int)
        boxes = results[0].boxes.xyxyn.cpu().numpy()
        for box, id in zip(boxes, ids):
            item = ', '.join(map(str, box))+ ",  " + str(id) +"\n"
            res += item
        print(res)
    cv2.imshow("d", frame)
    cv2.waitKey(0)

      
       

       
