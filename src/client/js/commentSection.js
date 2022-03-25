const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const headerAvatar = document.querySelector(".header__avatar");
const headerAvatarAnchor = headerAvatar.parentElement;

// create comments
const handleSubmit = async (event) => {
  event.preventDefault();
  const videoContainer = document.getElementById("videoContainer");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    textarea.value = "";
    return;
  }

  const addComment = (text, newCommentId) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = newCommentId;
    const div = document.createElement("div");
    const a = document.createElement("a");
    const userAvatarImg = document.createElement("img");
    const commentSpan = document.createElement("span");
    const deleteSpan = document.createElement("span");
    const smileAvatarSpan = document.createElement("span");
    const trashIcon = document.createElement("i");
    trashIcon.className = "fas fa-trash";
    div.className = "video__comment-ownerAndText";
    a.href = headerAvatarAnchor.href;
    commentSpan.innerText = `  ${text}`;
    deleteSpan.className = "video__comment-deleteBtn";
    if (!headerAvatar.src) {
      smileAvatarSpan.innerText = "😀";
      a.appendChild(smileAvatarSpan);
    } else {
      userAvatarImg.src = headerAvatar.src;
      a.appendChild(userAvatarImg);
    }
    div.appendChild(a);
    div.appendChild(commentSpan);
    deleteSpan.appendChild(trashIcon);
    newComment.appendChild(div);
    newComment.appendChild(deleteSpan);
    newComment.className = "video__comment";
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
  const comment = event.target.parentElement.parentElement;
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
