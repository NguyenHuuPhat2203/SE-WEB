const userRepository = require('../repositories/userRepository');

exports.updateProfile = (req, res) => {
  const bknetId = req.params.bknetId;
  const data = req.body;
  const user = userRepository.updateProfile(bknetId, data);

  if (!user)
    return res.status(404).json({ success: false, message: 'User not found' });

  res.json({ success: true, data: user });
};
