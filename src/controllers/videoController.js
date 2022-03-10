export const trending = (req, res) => res.render("home");
export const searchVideo = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload video");
export const watch = (req, res) => res.render("watch");
export const editVideo = (req, res) => res.render("edit");
export const deleteVideo = (req, res) => {
  return res.send(`Delete Video: ${req.params.id}`);
};
