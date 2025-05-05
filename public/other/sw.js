// const CACHE_NAME = "pwa-cache-v1";

// const ASSETS = [
//   "/",                      
//   "/index.php", 
//   "/tasks.php",
//   "/dashboard.php",
//   "/message.php",
//   "/components/header.php",
//   "/components/sidebar.php",
//   "/css/pallete.css",            
//   "/css/main.css",            
//   "/css/header.css",            
//   "/css/sidebar.css",            
//   "/css/main_table.css",  
//   "/css/main_window.css",              
//   "/js/components.js",            
//   "/js/main.js",            
//   "/js/table.js",            

//   "/img/icon/add.png",  
//   "/img/icon/avatar_dir_white.png",  
//   "/img/icon/avatar_dir.png",  
//   "/img/icon/avatar_rev_white.png",  
//   "/img/icon/avatar_rev.png",  
//   "/img/icon/burger_dir.png",  
//   "/img/icon/burger_rev.png",  
//   "/img/icon/close_dir.png",  
//   "/img/icon/delete.png",  
//   "/img/icon/edit.png",  
//   "/img/icon/lock_dir2.png",  
//   "/img/icon/lock_rev.png",  
//   "/img/icon/menu_opt.png",  
//   "/img/icon/notification_off_rev2.png",  
//   "/img/icon/notification_on_rev2.png",  
//   "/img/icon/status_on.png",  
//   "/img/icon/unlock_dir2.png",  
//   "/img/icon/unlock_rev.png",  

//   "/img/pwa/program_icon-128x128.png",  
//   "/img/pwa/program_icon-192x192.png",  
//   "/img/pwa/program_icon-256x256.png",  
//   "/img/pwa/program_icon-512x512.png",
// ];

// // Подія встановлення Service Worker
// // Відбувається при першому запуску або коли SW оновлюється
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Кешування ресурсів...");// логування не обовязкове
//       // Додаємо файли до кешу, якщо якийсь файл не вдасться завантажити, обробляємо помилку
//       return cache.addAll(ASSETS).catch(console.error);
//     })
//   );
// });

// // Подія обробки запитів від клієнта (браузера)
// // Якщо файл є в кеші – повертаємо його, інакше робимо запит до мережі
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.match(event.request).then((cachedResponse) => {
//         // Запит до мережі, якщо ресурсу немає в кеші
//         const networkFetch = fetch(event.request).then((networkResponse) => {
//           // Зберігаємо отриманий файл у кеш для майбутніх запитів
//           cache.put(event.request, networkResponse.clone());
//           return networkResponse;
//         });

//         // Повертаємо кешовану версію, якщо вона є, інакше робимо запит до мережі
//         return cachedResponse || networkFetch;
//       });
//     })
//   );
// });

// // Подія активації Service Worker
// // Видаляє старі кеші, які більше не використовуються
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys
//           .filter((key) => key !== CACHE_NAME) // Знаходимо старі кеші
//           .map((key) => caches.delete(key))   // Видаляємо їх
//       );
//     }).then(() => {
//       console.log("Новий Service Worker активовано.");
//       return self.clients.claim(); // Переключаємо новий SW для всіх вкладок
//     })
//   );
// });