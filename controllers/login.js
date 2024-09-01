import usersModel from '../models/users.js';

function login(req, res) {
  const { username, password } = req.body;
  console.log("username: ", username);
  console.log("pass: ", password);
  if (!username || !password) {
    res.status(400).send('Missing username or password');
    return;
  }
  async function authenticateUser(username, password) {
    const result = await usersModel.checkUserandPass(username, password);
    return result;
}
(async () => {
  const result = await authenticateUser(username, password);
  
  if (result.success) {
    // Send the profile picture and username back to the client
    res.status(200).json({
      profilePicture: result.picture,
      username: result.user.username,
    });
  } else {
    res.status(404).send('Invalid username or password');
  }
})();
}

export { login };
