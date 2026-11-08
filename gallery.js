(() => {
  const gallery = document.querySelector('.gallery');
  const dialog = gallery.querySelector('dialog');
  if (typeof dialog.showModal !== 'function') return;

  const links = Array.from(gallery.querySelectorAll('.gallery-image'));
  const title = dialog.querySelector('h3');
  const image = dialog.querySelector('img');
  const original = dialog.querySelector('[data-gallery-original]');
  const position = dialog.querySelector('[data-gallery-position]');
  const previous = dialog.querySelector('[data-gallery-previous]');
  const next = dialog.querySelector('[data-gallery-next]');
  let selected = 0;
  let opener;

  function show(index) {
    if (index < 0 || index >= links.length) return;
    selected = index;
    const link = links[index];
    title.textContent = link.closest('article').querySelector('h3').textContent;
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    original.href = link.href;
    position.textContent = `${index + 1} / ${links.length}`;
    previous.disabled = index === 0;
    next.disabled = index === links.length - 1;
  }

  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    show(index);
    dialog.showModal();
  }));
  previous.addEventListener('click', () => show(selected - 1));
  next.addEventListener('click', () => show(selected + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(selected - 1);
    else if (event.key === 'ArrowRight') show(selected + 1);
    else return;
    event.preventDefault();
  });
  dialog.addEventListener('close', () => opener?.focus());
})();
