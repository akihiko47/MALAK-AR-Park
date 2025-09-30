console.log('Скрипт начал выполняться');

// Функция для отправки клика на сервер
async function sendClickEvent(event) {
  console.log('Функция sendClickEvent вызвана');
  event.preventDefault();
  const originalHref = event.currentTarget.href;
  console.log('Целевая ссылка:', originalHref);

  try {
    console.log('Пытаюсь отправить запрос на localhost:5555/add');
    const response = await fetch('http://localhost:5555/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('MALAK')
    });
    console.log('Получен ответ, статус:', response.status);
    if (response.ok) {
      console.log('Клик успешно записан в базу данных');
    } else {
      console.warn('Ошибка при записи клика:', response.status);
    }
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error);
  } finally {
    console.log('Переход по ссылке:', originalHref);
    window.location.href = originalHref;
  }
  return false;
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
  try { localStorage.setItem('siteTheme', theme); } catch (e) {}
}
(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem('siteTheme'); } catch(e) {}
  if (saved === 'light') applyTheme('light'); else applyTheme('dark');
})();
themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light-theme');
  applyTheme(isLight ? 'dark' : 'light');
});

// Modal for gallery
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

document.querySelectorAll(".gallery img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

function closeModal() {
  modal.style.display = "none";
}
window.sendClickEvent = sendClickEvent;