import fs from "fs";

export const home = (req, res) => {
  fs.readdir("uploads/texts", (err, files) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    return res.render("files/home", { pageTitle: "File Home", files });
  });
};

export const read = (req, res) => {
  try {
    const {
      file: { path },
    } = req;
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return res.redirect("/files");
      }
      return res.render("files/read", { pageTitle: "Read File", data });
    });
  } catch (err) {
    return res.redirect("/files");
  }
};

export const file = (req, res) => {
  try {
    const { id } = req.params;
    const path = `uploads/texts/${id}`;
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return res.redirect("/files");
      }
      return res.render("files/file", { pageTitle: id, data });
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/files");
  }
};
