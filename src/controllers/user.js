const User = require("../models/User");

const getUserInformation = async (req, res) => {
  const uid = req.user.uid;

  try {
    const userInfo = await User.findOne({ uid });

    if (!userInfo) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }

    res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "Error",
      message: "Server encountered an error processing the request.",
    });
  }
};

module.exports = {
  getUserInformation,
};
