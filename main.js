import './assets/scss/all.scss';

import '/js/loading.js'

if (document.body.classList.contains('index-page')) {
  import('./js/pages/index.js');
}

if (document.body.classList.contains('admin-page')) {
  import('./js/pages/admin.js');
}