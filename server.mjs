import express from 'express';
import session from 'express-session';
import passport from './public/vk.js'; // Укажите правильный путь к вашему файлу с настройками Passport.js
import path from 'path';
import cors from 'cors';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import * as Sentry from './instrument.js'; 

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors()); // Используем cors middleware для обработки CORS

app.use(express.json()); // Анализ JSON-тел запросов
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));

// Обработчик маршрута для получения данных из URL после успешной авторизации
app.get('/auth/vk/callback', passport.authenticate('vk', { failureRedirect: '/' }), (req, res) => {
  Sentry.withScope(scope => {
    scope.setExtra('Параметры запроса:', req.query);
    res.redirect('/');
  });
});

// Маршрут для обмена silent token на access token
app.post('/', async (req, res) => {
  Sentry.withScope(async scope => {
    scope.setExtra('здарова');
    // res.header('Access-Control-Allow-Origin', 'https://adzhisaoauth.netlify.app');
    const { silentToken, uuid } = req.body; // Получаем silent token и uuid из тела запроса
    const serviceToken = '1df93b1d1df93b1d1df93b1da01ee17baa11df91df93b1d7bc421def9477373828960f8'; // Ваш сервисный токен

    try {
      const response = await fetch('https://api.vk.com/method/auth.exchangeSilentAuthToken', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
        body: `v=5.131&token=${silentToken}&access_token=${serviceToken}&uuid=${uuid}`
      });

      if (!response.ok) {
        throw new Error('Ошибка при обмене токенов');
      }

      const data = await response.json();

      if (Object.keys(data).length > 0) {
        scope.setExtra('Данные об успешном обмене токенов:', data);
        const accessToken = data.access_token;
        scope.setExtra('silent token server:', silentToken);
        scope.setExtra('uuid server:', uuid);
        scope.setExtra('Получен access token server:', accessToken);

        // res.header('Access-Control-Allow-Origin', 'https://adzhisaoauth.netlify.app'); // Добавляем заголовок Access-Control-Allow-Origin
        res.json(data); // Отправляем данные на клиенту
      } else {
        throw new Error('Ответ от сервера пустой');
      }
    } catch (error) {
      Sentry.captureException(error); // Заменяем console.error на Sentry.captureException
      res.status(500).json({ error: 'Ошибка при обмене токенов' });
    }
  });
});

// Добавление заголовка Access-Control-Allow-Private-Network в ответ
// app.use((req, res, next) => {
//   res.set('Access-Control-Allow-Private-Network', 'true');
//   next();
// });

app.listen(PORT, () => {
  Sentry.withScope(scope => {
    scope.setExtra(`Сервер запущен на порту ${PORT}`);
  });
});
