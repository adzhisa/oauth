const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('vk', new OAuth2Strategy({
  authorizationURL: 'https://oauth.vk.com/authorize',
  tokenURL: 'https://oauth.vk.com/access_token',
  clientID: 51921079,
  clientSecret: '4yVAMhVBrVB1tuuGzN3N',
  callbackURL: 'https://adzhisaoauth.netlify.app/auth/vk/callback', // Замените на ваш реальный URL-адрес обратного вызова
  profileFields: ['email', 'first_name', 'last_name', 'photo_max']
}, (accessToken, refreshToken, profile, done) => {
  // Здесь вы можете обработать полученные данные о пользователе или сохранить их в базу данных
  // В переменной profile будут содержаться данные о пользователе, полученные от ВКонтакте
  return done(null, profile);
}));

module.exports = passport;
