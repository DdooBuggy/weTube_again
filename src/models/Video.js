import mongoose from "mongoose";

const currenTime = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  return `${year}.${month}.${date}`;
};
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, min: 2, max: 20 },
  description: { type: String, required: true, trim: true, min: 2, max: 100 },
  createdAt: { type: String, required: true, default: currenTime() },
  hashtags: [{ type: String, trim: true, max: 20 }],
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((item) => item.trim())
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
