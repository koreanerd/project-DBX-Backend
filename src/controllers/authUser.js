module.exports.authUser = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      uid: req.user.uid,
      isInitialUser: req.user.isInitialUser,
      categoryIds: req.user.categoryIds,
    },
  });
};
