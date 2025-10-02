# AR-фотозона для СоюзмультПарка
## Запуск
Доступ по ссылке [souzmultpark-photozone.ru](https://souzmultpark-photozone.ru/)

Или по QR коду
![QR Code](/images/qr-code.png)


> [!NOTE] 
> При необходимости можно склонировать репозиторий и захостить локально

## Использованные технологии
HTML, CSS, JavaScript

Библиотека дополненной реальности: [MindAR](https://hiukim.github.io/mind-ar-js-doc/)

## Ресурсы
Библиотека дополненной реальности: [MindAR](https://hiukim.github.io/mind-ar-js-doc/)

Модели:
 - [Машина волка](https://sketchfab.com/3d-models/volks-wolfs-car-nu-pogodi-62239be23535431aa73736c14e5b7272)
 - [Растения](https://sketchfab.com/3d-models/plants-kit-6c2980169c1e44e499d94a67c1752477)
 - [Облака](https://free-game-assets.itch.io/free-horizontal-game-backgrounds)

## Архитектура
ВЕБ-БРАУЗЕР:
- **HTML**
  - `<a-scene>`
    - `<custom-scanning-overlay>`
    - `<a-camera>`
  - `<photoModal>`
- **CSS** - стили для контейнера и UI
- **JavaScript** (photo-capture.js) ↔ **MindAR** (трекер/камеры)
- **Three.js** - 3D графика, модели, сцены

↓ Загружает ресурсы

СЕРВЕР:
- HTML/CSS/JS файлы
- targets.mind (маркер)
- models/ (3D модели)

## Известные ограничение или баги
 - Трекинг изображения с одного ракурса
 - 3D сцены иногда "прыгают"
 - Недостаток 3D моделей
 - Восприимчивость к погодным условиям (снег, дождь)