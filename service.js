self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  if (requestURL.origin !== location.origin) return;
  
  if (requestURL.pathname.includes('proginter-validator')) return;

  event.respondWith(
    fetch(event.request).then(response => {
      if (response.status === 570) {
        triggerValidator().then(isValid => {
          if (!isValid) {
            // To stop all requests and reload the page.
            self.clients.matchAll().then(clients => {
              clients.forEach(client => client.navigate(client.url));
            });
          }
        });
      }
      return response;
    })
  );
});

function triggerValidator() {
  return fetch('/proginter-validator/$absolute_cookie/0/', {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(response => {
    return response.status === 200;
  });
}
