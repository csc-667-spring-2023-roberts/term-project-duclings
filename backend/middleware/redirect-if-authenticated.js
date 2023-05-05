const redirectIfAuthenticated = (request, response, next) => {
  const { user } = request.session;

  if (user !== undefined && user.id !== undefined) {
    response.render("lobby");
  } else {
    next();
  }
};

module.exports = redirectIfAuthenticated;
