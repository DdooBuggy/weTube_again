import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

// home
export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

// search video
export const searchVideo = async (req, res) => {
  let videos = [];
  const { keyword } = req.query;
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

// watch video
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
        model: "User",
      },
    });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

// edit video
export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You're not the owner of this video.");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: video.title, video });
};
export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You're not the owner of this video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

// delete video
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You're not the owner of this video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  req.flash("info", "Video deleted.");
  return res.redirect("/");
};

// upload video
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    files: { video, thumbnail },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      description,
      owner: _id,
      fileUrl: video[0].location,
      thumbnailUrl: thumbnail[0].location,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();
    req.flash("success", "Video uploaded.");
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("404", { pageTitle: error._message });
  }
};

// register view
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

// comment
export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  await video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

// delete comment
export const deletComment = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const comment = await Comment.findById(id).populate("video");
  const video = await Video.findById(comment.video._id);
  // const user = await User.findById(_id);
  if (!comment) {
    return res.status(404).render("404", { pageTitle: "Comment not found" });
  }
  if (String(comment.owner) !== String(_id)) {
    req.flash("error", "You're not the owner of this comment.");
    return res.status(403).redirect("/");
  }
  await Comment.findByIdAndDelete(id);
  video.comments.splice(video.comments.indexOf(id), 1);
  video.save();
  // user.comments.splice(user.comments.indexOf(id), 1);
  // user.save();
  return res.sendStatus(200);
};
