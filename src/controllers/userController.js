import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

// join
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { userId, email, password, password2, name, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }
  const existsUserId = await User.exists({ userId });
  if (existsUserId) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This userId is already taken",
    });
  }
  const existsEmail = await User.exists({ email });
  if (existsEmail) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This email is already taken",
    });
  }
  try {
    await User.create({
      userId,
      email,
      password,
      name,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

// login
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { userId, password } = req.body;
  const foundUser = await User.findOne({ userId, socialOnly: false });
  if (!foundUser) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists",
    });
  }
  const passwordConfirm = await bcrypt.compare(password, foundUser.password);
  if (!passwordConfirm) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = foundUser;
  return res.redirect("/");
};

// GithubLogin
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
    return res.redirect("/login");
  }
};

// logout
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

// edit profile
export const getEdit = (req, res) => {
  return res.render("editProfile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { userId, email, name, location },
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
      return res.render("editProfile", {
        pageTitle: "Edit Profile",
        errorMessage: "This username/email is already taken.",
      });
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      userId,
      email,
      name,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

// see user profile
export const userProfile = (req, res) => res.send("User Profile");

// delete user
export const deleteUser = (req, res) => res.send("Delete User");
