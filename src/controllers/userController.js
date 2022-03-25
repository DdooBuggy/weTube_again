import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import aws from "aws-sdk";
const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

//-----------------------------------------------------------------//
//          join
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { userId, email, password, password2, name, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    req.flash("error", "Password confirmation does not match");
    return res.status(400).render("join", { pageTitle });
  }
  const existsUserId = await User.exists({ userId });
  if (existsUserId) {
    req.flash("error", "This userId is already taken");
    return res.status(400).render("join", { pageTitle });
  }
  const existsEmail = await User.exists({ email });
  if (existsEmail) {
    req.flash("error", "This email is already taken");
    return res.status(400).render("join", { pageTitle });
  }
  try {
    await User.create({
      userId,
      email,
      password,
      name,
      location,
    });
    req.flash("success", "Welcome! and plz login.");
    return res.redirect("/login");
  } catch (error) {
    req.flash("error", error._message);
    return res.status(400).render("join", { pageTitle });
  }
};

//-----------------------------------------------------------------//
//          login
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { userId, password } = req.body;
  const foundUser = await User.findOne({ userId, socialOnly: false });
  if (!foundUser) {
    req.flash("error", "An account with this username does not exists");
    return res.status(400).render("login", { pageTitle });
  }
  const passwordConfirm = await bcrypt.compare(password, foundUser.password);
  if (!passwordConfirm) {
    req.flash("error", "Wrong password");
    return res.status(400).render("login", { pageTitle });
  }
  req.session.loggedIn = true;
  req.session.user = foundUser;
  return res.redirect("/");
};

//-----------------------------------------------------------------//
//          githubLogin
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  console.log(process.env.GH_CLIENT_ID);
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    client_secret: process.env.GH_CLIENT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      req.flash("error", "We cannot use you're available email in Gitbub.");
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name ? userData.name : "Unknown",
        userId: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    req.flash("error", "Failed to login with Github.");
    return res.redirect("/login");
  }
};

//-----------------------------------------------------------------//
//          logout
export const logout = (req, res) => {
  req.flash("info", "Bye Bye");
  req.session.destroy();
  return res.redirect("/");
};

//-----------------------------------------------------------------//
//          edit profile
export const getEdit = (req, res) => {
  return res.render("editProfile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { userId, email, name, location },
    file,
  } = req;
  let changedInfo = [];
  if (userId !== req.session.user.userId) {
    changedInfo.push({ userId });
  }
  if (email !== req.session.user.email) {
    changedInfo.push({ email });
  }
  if (changedInfo.length > 0) {
    const existingUser = await User.findOne({ $or: changedInfo });
    if (existingUser && existingUser._id.toString() !== _id) {
      req.flash("error", "This username/email is already taken.");
      return res.render("editProfile", { pageTitle: "Edit Profile" });
    }
  }
  const isHeroku = process.env.NODE_ENV === "production";
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
      userId,
      email,
      name,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  // delete s3 files
  if (req.file && avatarUrl && isHeroku) {
    s3.deleteObject(
      {
        Bucket: "buggy-wetube-practice/images",
        Key: avatarUrl.split("/")[-1],
      },
      (err, data) => {
        if (err) {
          throw err;
        }
        console.log("s3 deleteObject", data);
      }
    );
  }
  req.flash("success", "Profile updated.");
  return res.redirect("/users/edit");
};

//-----------------------------------------------------------------//
//          change password
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
  }
  return res.render("changePassword", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { currentPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    req.flash("error", "The current password is incorrect");
    return res
      .status(400)
      .render("changePassword", { pageTitle: "Change Password" });
  }
  if (newPassword !== newPassword2) {
    req.flash("error", "The password does not match the confirmation");
    return res.status(400).render("changePassword", {
      pageTitle: "Change Password",
    });
  }
  user.password = newPassword;
  await user.save();
  req.flash("success", "Password updated.");
  return res.redirect("/users/logout");
};

//-----------------------------------------------------------------//
//          see user profile
export const userProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  return res.render("profile", { pageTitle: user.name, user });
};

//-----------------------------------------------------------------//
//          delete user
export const deleteUser = (req, res) => res.send("Delete User");
