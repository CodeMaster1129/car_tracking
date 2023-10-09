import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import Modal from "./components/Utils";
import axios from "axios";
const carInfo = require("./car.json");
let target = [];
let selectedCar = null;
function App() {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [frameData, setFrameData] = useState(null);
  const [trackData, setTrackData] = useState("");
  const [cursor, setCursor] = useState("normal");
  const [video, setVideo] = useState(null);
  const [clickedIds, setClickedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const upload_video = useRef(null);
  useEffect(() => {
    let ids = [];
    const items = trackData.split("\n");
    for (let i = 0; i < items.length - 1; i++) {
      ids.push(items[i].split(", ")[4]);
    }
    for (let j = 0; j < target.length; j++) {
      const index = ids.indexOf(target[j].id);
      if (index !== -1) {
        let [x1, y1, x2, y2, id] = items[index].split(", ");
        x1 = parseFloat(x1);
        x2 = parseFloat(x2);
        y1 = parseFloat(y1);
        target[j].pos = [((x1 + x2) / 2) * 1000, y1 * 1000];
        // draw();
      }
    }
  }, [trackData]);
  const draw = () => {
    const start_x = 250;
    const start_y = 150;
    const [end_x, end_y] = target[0].pos;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageSrc = require("./assets/imgs/0.png");
    const img = new Image();
    img.src = imageSrc;
    const newWidth = 40;
    const newHeight = 40;
    canvas.width = 1000;
    canvas.height = 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, start_x, start_y, newWidth, newHeight);
    ctx.font = "bold 35px Times New Roman";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    const text = "Tony Waley";
    ctx.fillText(text, start_x + newWidth + 5, start_y + 35);
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    ctx.clearRect(0, start_y + newHeight, 1000, 1000);
    ctx.beginPath();
    ctx.moveTo(start_x + (textWidth + newWidth) / 2, start_y + newHeight + 7);
    ctx.lineTo(
      start_x + (textWidth + newWidth) / 2 + 20,
      start_y + newHeight + 7
    );
    ctx.lineTo(end_x, end_y);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 1000, 1000);
    gradient.addColorStop(0, "gray");
    gradient.addColorStop(1, "lightgray");
    ctx.fillStyle = gradient;
    ctx.fill();
    setIsLoaded(true);
  };
  const inform = (text) => {
    return toast.error(text, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  const handleClick = () => {
    if (clickedIds.length === 0)
      inform("Please select car number and driver name.");
    else {
      if (
        target.length < clickedIds.length &&
        target.some((item) => item.id === selectedCar[2]) === false
      ) {
        target.push({
          car_idx: clickedIds[target.length],
          id: selectedCar[2],
          pos: [selectedCar[0], selectedCar[1]],
        });
        appear(250, 150, selectedCar[0], selectedCar[1]);
      }
    }
  };
  const handleMouseMove = (event) => {
    const rect = event.target.getBoundingClientRect();
    let data = trackData.split("\n");
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    let flag = false;
    for (let i = 0; i < data.length - 1; i++) {
      let [x1, y1, x2, y2, id] = data[i].split(", ");
      x1 = parseFloat(x1);
      x2 = parseFloat(x2);
      y1 = parseFloat(y1);
      y2 = parseFloat(y2);
      if (x > x1 && x < x2 && y > y1 && y < y2) {
        setCursor("pointer");
        selectedCar = [((x1 + x2) / 2) * 1000, y1 * 1000, id];
        flag = true;
      }
    }
    flag === false && setCursor("normal");
  };

  const appear = (start_x, start_y, end_x, end_y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imageSrc = require("./assets/imgs/0.png");
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const newWidth = 40;
      const newHeight = 40;
      ctx.drawImage(img, start_x, start_y, newWidth, newHeight);
      ctx.font = "bold 35px Apple Chancery, cursive";
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 5;
      const text = "Tony Waley";
      ctx.fillText(text, start_x + newWidth + 5, start_y + 35);
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      let step = 0;
      const total_step = 10;
      const timerCallBack = (TIMESPAN = 10) => {
        if (step === total_step + 1) return;
        ctx.clearRect(0, start_y + newHeight, 1000, 1000);
        ctx.beginPath();
        ctx.moveTo(
          start_x + (textWidth + newWidth) / 2,
          start_y + newHeight + 7
        );
        ctx.lineTo(
          start_x + (textWidth + newWidth) / 2 + 20,
          start_y + newHeight + 7
        );
        ctx.lineTo(
          start_x +
            (textWidth + newWidth) / 2 +
            10 +
            ((end_x - (textWidth + newWidth) / 2 - 10 - start_x) / total_step) *
              step,
          start_y +
            newHeight +
            7 +
            ((end_y - newHeight - 7 - start_y) / total_step) * step
        );
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, 0, 1000, 1000);
        gradient.addColorStop(0, "gray");
        gradient.addColorStop(1, "lightgray");
        ctx.fillStyle = gradient;
        ctx.fill();
        step += 1;
        setTimeout(timerCallBack, TIMESPAN);
      };
      timerCallBack(300);
      setIsLoaded(true);
    };
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClose = async () => {
    setVideo(null);
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/close`,
    })
      .then((res) => {})
      .catch((err) => {
        toast.error(err);
      });
  };
  const handleOk = (car_num, driver_name, file_url) => {
    carInfo[clickedIds[0]].number = car_num;
    carInfo[clickedIds[0]].name = driver_name;
    carInfo[clickedIds[0]].gnName = file_url;
    setIsModalOpen(false);
  };

  const handleNDI = () => {
    setVideo("start");
    const eventSource = new EventSource("http://127.0.0.1:5000/ndi");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTrackData(data.data);
      setFrameData(`data:image/jpeg;base64,${data.frame}`);
    };
    eventSource.onerror = (error) => {
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  };

  const Upload_Video = async (e) => {
    const selectedVideo = e.target.files[0];
    selectedVideo && setVideo(selectedVideo["name"]);
    e.target.value = null;
    const formData = new FormData();
    formData.append("video", selectedVideo["name"]);
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/upload`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        const eventSource = new EventSource("http://127.0.0.1:5000/video");
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setTrackData(data.data);
          setFrameData(`data:image/jpeg;base64,${data.frame}`);
        };
        eventSource.onerror = (error) => {
          eventSource.close();
        };
        return () => {
          eventSource.close();
        };
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="bg-[#02121d] w-[100%] h-[100vh] flex min-w-[800px]">
      <input
        type="file"
        ref={upload_video}
        onChange={Upload_Video}
        style={{ display: "none" }}
      />
      {isModalOpen && (
        <div className="z-40">
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            onOk={handleOk}
            item_info={carInfo[clickedIds[0]]}
          >
            <h1 className="text-2xl font-semibold mb-4">Edit Car Info</h1>
          </Modal>
        </div>
      )}
      <div
        className={`w-[80%] h-[90%] m-[2%] border-slate-300 ${
          video ? "border-none" : "border-dashed"
        } rounded-[20px] border-2`}
      >
        <div
          className="w-[100%] h-[100%] text-white justify-center items-center flex relative  text-[42px]"
          onClick={() => {
            cursor === "pointer" && handleClick();
          }}
          onMouseMove={handleMouseMove}
        >
          {video ? (
            <>
              <canvas
                ref={canvasRef}
                className={`${
                  isLoaded
                    ? "opacity-100 transition-opacity duration-1000 ease-in-out"
                    : "opacity-0"
                } w-[100%] h-[100%] absolute cursor-${cursor}`}
              />
              <img src={frameData} alt="" className="w-[100%] h-[100%]" />
              <div className="absolute top-[5%] left-[3%] w-[17%] h-[90%] bg-[black] z-10"></div>
            </>
          ) : (
            <div
              className={`${
                !video && "cursor-pointer"
              } w-[40%] h-[150px] hover:text-[50px] flex justify-center items-center rounded-[20px]`}
              onClick={() => {
                video === null && upload_video.current.click();
              }}
            >
              Click here to upload video
            </div>
          )}
        </div>
      </div>
      <div className="w-[20%] h-[100%] flex flex-col">
        <div className="rounded-[5px] p-[10px] border-[1px] border-[gray] border-dashed w-[90%] h-[60%] mt-[10%] flex flex-wrap items-center justify-between gap-[3px]">
          {carInfo.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (clickedIds.includes(index)) {
                  setClickedIds((prv) => prv.filter((item) => item !== index));
                } else {
                  if (clickedIds.length < 3)
                    setClickedIds((prv) => [...prv, index]);
                  else inform("You can selet to 3 cars");
                }
              }}
            >
              <div
                className={`text-[white] border-[#28dbd2] border-[2px] items-center cursor-pointer text-[13px] flex flex-col rounded-[5px] font-serif font-medium p-[3px] hover:text-[grey] ${
                  clickedIds.includes(index) ? "bg-[#28dbd2]" : ""
                }`}
              >
                <p>{item.number}</p>
                <p>{item.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-[90%] h-[27%] mt-[10%] border-[1px] rounded-[5px] border-dashed border-[grey] flex items-center justify-center flex-col gap-[20px]">
          <div
            className="w-[60%] bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 hover:text-[22px] pointer-cursor text-[20px] flex items-center justify-center"
            onClick={() => {
              if (clickedIds.length !== 1) {
                inform("Please select only one car to edit.");
              } else {
                openModal();
              }
            }}
          >
            Edit
          </div>
          <div
            className="w-[60%] bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 hover:text-[22px] pointer-cursor text-[20px] flex items-center justify-center"
            onClick={handleNDI}
          >
            NDI
          </div>
          <div
            className="w-[60%] bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 hover:text-[22px] pointer-cursor text-[20px] flex items-center justify-center"
            onClick={handleClose}
          >
            Close
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
