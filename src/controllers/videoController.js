export const trending = (req, res) => res.send("Home, trending videos");
export const searchVideo = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload video");
export const watch = (req, res) => {
  return res.send(`Watch Video: ${req.params.id}`);
};
export const editVideo = (req, res) => {
  return res.send(`Edit Video: ${req.params.id}`);
};
export const deleteVideo = (req, res) => {
  return res.send(`Delete Video: ${req.params.id}`);
};
