const commentForm = document.getElementById("commentForm");
const commentArea = document.getElementById("commentArea");
const video = document.querySelector("video");
const commentDeleteBtns = document.getElementsByClassName(
  "commentSection__deleteBtn"
);
const commentToggles = document.getElementsByClassName(
  "commentSection__toggle"
);

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = commentArea.value;
  const videoId = video.dataset.id;
  if (!text.length) return;
  const response = await fetch(`/api/movies/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  commentArea.value = "";
  if (response.status === 201) {
    window.location.reload();
  }
};

const handleDeleteBtn = async (e) => {
  const commentId = e.target.dataset.id;
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    window.location.reload();
  }
};

const handleToggle = (e) => {
  const deleteBtn = document.getElementById(e.target.dataset.id);
  deleteBtn.classList.toggle("showing");
};

const handleResize = () => {
  if (window.innerWidth <= 570) {
    commentArea.cols = "50";
  } else {
    commentArea.cols = "60";
  }
};

commentForm.addEventListener("submit", handleSubmit);
if (commentDeleteBtns.length) {
  for (let i = 0; i < commentDeleteBtns.length; i++) {
    commentDeleteBtns[i].addEventListener("click", handleDeleteBtn);
  }
}
if (commentToggles.length) {
  for (let i = 0; i < commentToggles.length; i++) {
    commentToggles[i].addEventListener("click", handleToggle);
  }
}

if (commentForm) {
  handleResize();
  window.addEventListener("resize", handleResize);
}
