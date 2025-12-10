const userRepository = require("../repositories/userRepositoryMongo");

exports.getCurrentUser = async (req, res) => {
  try {
    // req.user đã được set bởi protect middleware
    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = (req, res) => {
  const bknetId = req.params.bknetId;
  const data = req.body;
  const user = userRepository.updateProfile(bknetId, data);

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, data: user });
};
