const commentForm = document.getElementById("commentForm");
const commentArea = document.getElementById("commentArea");
const video = document.querySelector("video");
const commentText = document.getElementById("commentText");
const commentDeleteBtn = document.getElementById("commentDeleteBtn");

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

const handleDeleteBtn = async () => {
  const commentId = commentText.dataset.id;
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    window.location.reload();
  }
};

commentForm.addEventListener("submit", handleSubmit);
commentDeleteBtn.addEventListener("click", handleDeleteBtn);
