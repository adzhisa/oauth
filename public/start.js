// Требуем необходимые модули
const VKID = require('@vkid/sdk');
const { renderOneTapButton } = require('./onetap');

// Инициализируем библиотеку VKID
VKID.Config.set({
  app: 51921079, // Идентификатор вашего приложения VK.
  redirectUrl: 'adzhisaoauth.netlify.app', // URL-адрес, на который пользователь будет перенаправлен после авторизации.
  state: 4356567564534 // Произвольная строка состояния приложения.
});

// После загрузки DOM вызываем функцию для отрисовки кнопки One Tap
document.addEventListener("DOMContentLoaded", function() {
  renderOneTapButton();
});
