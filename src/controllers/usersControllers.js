export const users = (req, res) => {
  return res.send("users");
};

export const user = (req, res) => {
  const { id } = req.params;
  return res.send(`user: ${id}`);
};

export const editProfile = (req, res) => {
  return res.send("edit-profile");
};
