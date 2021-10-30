const keys = require("../keys/index");

module.exports = function (to, token) {
  return {
    to,
    from: keys.EMAIL_FROM,
    subject: "Ссылка для подтверждения регистрации на сайте",
    html: `<h2>Пожалуйста, нажмите по ссылке ниже,чтобы подтвердить регистрацию на нашем сайте</h2>
            <a href="${keys.CLIENT_URL}/verification/${token}">Нажмите</a>`,
  };
};
