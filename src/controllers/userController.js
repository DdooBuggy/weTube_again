import User from "../models/User";
import bcrypt from "bcrypt";

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
  const pageTitle = "login";
  const { userId, password } = req.body;
  const foundUser = await User.findOne({ userId });
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

// logout
export const logout = (req, res) => res.send("logout");

// edit profile
export const edit = (req, res) => res.send("Edit User");

// delete user
export const deleteUser = (req, res) => res.send("Delete User");

// see user profile
export const userProfile = (req, res) => res.send("User Profile");
