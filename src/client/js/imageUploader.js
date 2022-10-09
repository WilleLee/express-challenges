const imageFile = document.getElementById("imageFile");
const imageFilename = document.getElementById("imageFilename");

const $NoFileMessage = "No File Selected";

imageFilename.innerText = $NoFileMessage;

const handleFileChange = (e) => {
  const filename = e.target.files[0].name;
  if (filename) {
    imageFilename.innerText = filename;
  } else {
    imageFilename.innerText = $NoFileMessage;
  }
};

imageFile.addEventListener("change", handleFileChange);
