import finder
import receiver
import cv2
import imutils

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
	frame = reciever.read()
	frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)
	cv2.imshow("image", frame)
	k = cv2.waitKey(1) & 0xff
	if k == 27:
		break

cv2.destroyAllWindows()