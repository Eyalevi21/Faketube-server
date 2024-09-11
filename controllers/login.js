import loginModel from '../models/loginModel.js';

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send('Missing username or password');
    return;
  }
  async function authenticateUser(username, password) {
    const result = await loginModel.checkUserAndPass(username, password);
    return result;
}
(async () => {
  const result = await authenticateUser(username, password);
  
  if (result.success) {
    // Send the profile picture and username back to the client
    res.status(200).json({
      profilePicture: result.user.profile,
      username: result.user.username,
      nickname: result.user.nickname,
    });
  } else {
    res.status(404).send('Invalid username or password');
  }
})();
}

export { login };
