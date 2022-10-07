const commentForm = document.getElementById("commentForm");
const commentArea = document.getElementById("commentArea");
const video = document.querySelector("video");

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

commentForm.addEventListener("submit", handleSubmit);
