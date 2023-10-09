import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import Modal from "./components/Utils";
import axios from "axios";
const carInfo = require("./car.json");

function App() {
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);
  useEffect(() => {
    video && videoRef.current.play();
  }, [video]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // console.log("M", x);
    // console.log("Mss", y);
    setMousePosition({ x, y });
  };

  const [clickedIds, setClickedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const upload_video = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = (car_num, driver_name, file_url) => {
    carInfo[clickedIds[0]].number = car_num;
    carInfo[clickedIds[0]].name = driver_name;
    carInfo[clickedIds[0]].gnName = file_url;
    setIsModalOpen(false);
  };

  const handleNDI = () => {};

  const Upload_Video = async (e) => {
    const selectedVideo = e.target.files[0];
    selectedVideo && setVideo(URL.createObjectURL(selectedVideo));
    e.target.value = null;
    const formData = new FormData();
    formData.append("video", selectedVideo);
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/upload`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        console.log(res);
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
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onOk={handleOk}
          item_info={carInfo[clickedIds[0]]}
        >
          <h1 className="text-2xl font-semibold mb-4">Edit Car Info</h1>
        </Modal>
      )}
      <div
        className={`w-[80%] h-[90%] m-[2%] border-slate-300 ${
          video ? "border-none" : "border-dashed"
        } rounded-[20px] border-2`}
      >
        <div
          className={`w-[100%] h-[100%] text-white justify-center items-center flex ${
            !video && "cursor-pointer"
          } text-[42px]`}
          onClick={() => {
            video === null && upload_video.current.click();
          }}
          onMouseMove={handleMouseMove}
        >
          {video ? (
            <video src={video} ref={videoRef} className="w-[100%] h-[100%]" />
          ) : (
            "Click here to load video from local"
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
                  else
                    toast.error("You can selet to 3 cars", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: false,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                    });
                }
              }}
            >
              <div
                className={`text-[white] border-[#28dbd2] border-[2px] items-center cursor-pointer text-[13px] flex flex-col rounded-[5px] font-serif font-medium p-[3px] hover:font-semibold ${
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
                toast.error("Please select only one car to edit.", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
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
            onClick={() => setVideo(null)}
          >
            Close
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
