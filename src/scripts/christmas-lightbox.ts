// Open gallery photos in an on-page viewer so visitors (often inside the
// Instagram or Facebook in-app browser) stay on the landing page. The links
// keep their href, so the photo still opens if this script does not run.
const dialog = document.querySelector<HTMLDialogElement>("#lightbox");
const links = [...document.querySelectorAll<HTMLAnchorElement>("a[data-lightbox]")];

if (dialog && typeof dialog.showModal === "function" && links.length) {
  const image = dialog.querySelector<HTMLImageElement>("#lightbox-image")!;
  const caption = dialog.querySelector<HTMLElement>("#lightbox-caption")!;
  const count = dialog.querySelector<HTMLElement>("#lightbox-count")!;
  let index = 0;
  let touchStartX: number | null = null;

  const show = (next: number) => {
    index = (next + links.length) % links.length;
    const link = links[index];
    const alt = link.querySelector("img")?.alt ?? "";
    image.src = link.href;
    image.alt = alt;
    caption.textContent = alt;
    count.textContent = `${index + 1} / ${links.length}`;
  };

  links.forEach((link, i) => {
    link.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector("[data-lightbox-close]")?.addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => show(index - 1));
  dialog.querySelector("[data-lightbox-next]")?.addEventListener("click", () => show(index + 1));

  // A tap on the dark backdrop (the dialog itself, not its content) closes it.
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });

  dialog.addEventListener("touchstart", event => {
    touchStartX = event.touches[0]?.clientX ?? null;
  }, { passive: true });
  dialog.addEventListener("touchend", event => {
    if (touchStartX === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    touchStartX = null;
    if (Math.abs(deltaX) > 45) show(index + (deltaX < 0 ? 1 : -1));
  });

  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
  });
}
