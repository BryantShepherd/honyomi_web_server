exports.Regex = {
  CONTROLLER_REGEXP: /\w+\.controller\.js/,
  ROUTER_REGEXP: /\w+\.route\.js/,
  SERVICE_REGEXP: /\w+\.service\.js/,
};

exports.HTTPErrorMessage = {
  DEFAULT: "Something went wrong",
  WRONG_EMAIL_OR_PASSWORD: "WRONG_EMAIL_OR_PASSWORD",
};

exports.COOKIE_SECRET = process.env.COOKIE_SECRET || "abcxyz";

exports.BCRYPT_SALT_ROUND = 2;