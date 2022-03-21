const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");

// create comments
const handleSubmit = async (event) => {
  event.preventDefault();
  const videoContainer = document.getElementById("videoContainer");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return;
  }

  const addComment = (text, newCommentId) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = newCommentId;
    const icon = document.createElement("i");
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    icon.className = "fas fa-comment";
    span.innerText = `  ${text}`;
    span2.innerText = "❌";
    newComment.className = "video__comment";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    newComment.addEventListener("click", handleDelete);
  };
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

// delete comments
const commentDeleteBtns = document.querySelectorAll(
  ".video__comment-deleteBtn"
);
const handleDelete = async (event) => {
  const comment = event.target.parentElement;
  const commentId = comment.dataset.id;
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    comment.remove();
  }
};
if (commentDeleteBtns !== []) {
  commentDeleteBtns.forEach(function (element) {
    element.addEventListener("click", handleDelete);
  });
}
