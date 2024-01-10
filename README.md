# OKX
Скрипт для вывода с OKX

# Установка
```npm i```

Скопировать и переименовать config.json_ в config.json

Создать [API ключ](https://www.okx.com/en/account/my-api) с доступом на вывод

Заполнить config.json

apikey: apikey при создании ключа

secretkey: secretkey при создании ключа

passphrase: passphrase при создании ключа

API_PAUSE: 500 (500-1000)

PAUSE_BETWEEN_WITHDRAWL_SEC: 300 (пауза в секундах, 5 минут)

# Библиотеки
https://www.npmjs.com/package/crypto-js

https://www.npmjs.com/package/axios

# Использование
Создаем Google или Excel таблицу из 4 столбцов. В первый заполняем адрес, во второй тикер токена, в третий сеть вывода, в четвертый количество.

Пример: withdrawl.txt

Копируем таблицу в буфер обмена, вставляем в withdrawl.txt, сохраняем


Отблагодарить автора: [0x99984bBFF08C169796E1B070CFfCb3795fAf9999](https://debank.com/profile/0x99984bBFF08C169796E1B070CFfCb3795fAf9999)