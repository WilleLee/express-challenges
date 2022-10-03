const videoFile = document.getElementById("videoFile");
const videoFilename = document.getElementById("videoFilename");

const $NoFileMessage = "No File Selected";

videoFilename.innerText = $NoFileMessage;

const handleFileChange = (e) => {
  const filename = e.target.files[0].name;
  if (filename) {
    videoFilename.innerText = filename;
  } else {
    videoFilename.innerText = $NoFileMessage;
  }
};

videoFile.addEventListener("change", handleFileChange);
