// onetap.js
if (typeof window.VKIDSDK !== 'undefined') {
  console.log("Библиотека @vkid/sdk доступна");

  window.VKIDSDK.Config.set({
    app: 51921079, 
    redirectUrl: 'https://adzhisaoauth.netlify.app/',
    state: 5435656756454 
  });

  function renderOneTapButton() {
    const serviceIconVK = document.querySelector('.service-icon.vk');
    const serviceContainer = serviceIconVK.parentElement;

    serviceIconVK.addEventListener('click', function() {
      const popup = document.createElement('div');
      popup.classList.add('popup');

      const vkIdContainer = document.createElement('div');
      vkIdContainer.id = 'VkIdSdkOneTap';

      popup.appendChild(vkIdContainer);
      serviceContainer.appendChild(popup);

      const oneTap = new window.VKIDSDK.OneTap();

      if (vkIdContainer) {
        console.log("Контейнер присутствует в разметке. Отрисовка кнопки...");

        oneTap.render({
          container: vkIdContainer,
          scheme: window.VKIDSDK.Scheme.DARK,
          lang: window.VKIDSDK.Languages.RUS,
        });

      } else {
        console.error("Контейнер не найден в разметке. Пропуск отрисовки кнопки.");
      }

      const closeButton = document.createElement('button');
      closeButton.textContent = 'x';
      closeButton.classList.add('close-button');
      closeButton.addEventListener('click', function() {
        popup.remove();
      });

      popup.appendChild(closeButton);
    });
  }

  async function fetchExchangeToken(silentToken, uuid) {
    console.log("Отправка silent token на обмен");
    try {
      const response = await fetch('https://oauth2-422819.web.app/', {
        method: 'POST',
        mode: 'no-cors', // отключаем проверку CORS
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
        body: `silentToken=${silentToken}&uuid=${uuid}`
      });

      if (!response.ok) {
        throw new Error('Ошибка при обмене токенов');
      }

      const data = await response.json();
      const accessToken = data.accessToken;

      console.log("Получен access token onetap:", accessToken);
      return data; // Возвращаем данные

    } catch (error) {
      console.error('Ошибка при отправке silent token на обмен:', error);
      throw error; // Передаем ошибку дальше
    }
  }

  function displayServerResponse(responseData) {
    // Выводите ответ от сервера в консоль или в любой другой интерфейс
    console.log("Ответ от сервера:", responseData);
  }

  document.addEventListener("DOMContentLoaded", function() {
    renderOneTapButton();

    const urlParams = new URLSearchParams(window.location.search);
    const payload = urlParams.get('payload');

    if (payload) {
      const payloadObject = JSON.parse(decodeURIComponent(payload));
      const silentToken = payloadObject.token;
      const uuid = payloadObject.uuid;

      if (silentToken && uuid) {
        console.log("Получен uuid:", uuid)
        console.log("Получен silent token:", silentToken);
        // Теперь отправляем silentToken и uuid на бэкэнд
        fetchExchangeToken(silentToken, uuid)
          .then(responseData => {
            displayServerResponse(responseData);
          })
          .catch(error => {
            console.error("Ошибка при получении ответа от сервера:", error);
          });
      } else {
        console.log("URL-параметр silent_token отсутствует или пуст.");
      }
    } else {
      console.log("URL-параметр payload отсутствует или пуст.");
    }
  });


} else {
  console.error("Библиотека @vkid/sdk не доступна. Проверьте правильность подключения.");
}

