const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");

const handleSubmit = (event) => {
  event.preventDefault();
  const videoContainer = document.getElementById("videoContainer");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
