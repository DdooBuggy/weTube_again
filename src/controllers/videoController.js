export const trending = (req, res) => {
  const videos = [
    {
      title: "first video",
      rating: 4,
      comments: 3,
      createdAt: "2 min ago",
      views: 20,
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
  return res.render("home", { pageTitle: "Home", videos });
};
export const searchVideo = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload video");
export const watch = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const editVideo = (req, res) =>
  res.render("edit", { pageTitle: "Edit" });
export const deleteVideo = (req, res) => {
  return res.send(`Delete Video: ${req.params.id}`);
};
