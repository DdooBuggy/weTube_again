let videos = [
  {
    title: "first video",
    rating: 4,
    comments: 3,
    createdAt: "2 min ago",
    views: 0,
    id: 1,
  },
  {
    title: "second video",
    rating: 4,
    comments: 90,
    createdAt: "26 min ago",
    views: 10,
    id: 2,
  },
  {
    title: "third video",
    rating: 3,
    comments: 7,
    createdAt: "34 min ago",
    views: 45,
    id: 3,
  },
];
export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const searchVideo = (req, res) => res.send("Search Videos");
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};
export const getEditVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEditVideo = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = (req, res) => {
  return res.send(`Delete Video: ${req.params.id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 5,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
