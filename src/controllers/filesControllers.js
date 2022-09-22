import fs from "fs";

const $HOME_TITLE = "TXT to HTML";

export const home = (req, res) => {
  fs.readdir("uploads/texts", (err, files) => {
    if (err) {
      console.log(err);
      return res.render("files/home", {
        pageTitle: $HOME_TITLE,
        errorMessage: "FAILED TO LOAD TEXT FILES",
      });
    }
    return res.render("files/home", { pageTitle: $HOME_TITLE, files });
  });
};

export const read = (req, res) => {
  try {
    const {
      file: { filename, path },
    } = req;
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).redirect("/files");
      }
      return res.render("files/read", { pageTitle: filename, data });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).redirect("/files");
  }
};

export const file = (req, res) => {
  try {
    const { id } = req.params;
    const path = `uploads/texts/${id}`;
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).redirect("/files");
      }
      return res.render("files/file", { pageTitle: id, data });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).redirect("/files");
  }
};
