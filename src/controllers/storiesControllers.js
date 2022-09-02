export const story = (req, res) => {
  const { id } = req.params;
  return res.send(`story: ${id}`);
};

export const editStory = (req, res) => {
  const { id } = req.params;
  return res.send(`edit story( ${id} )`);
};

export const deleteStory = (req, res) => {
  const { id } = req.params;
  return res.send(`delete story( ${id} )`);
};
