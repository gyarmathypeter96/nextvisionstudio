// Mobile "Book" bar: appears once the hero's own buttons scroll away and hides
// while the booking form or the cookie banner is on screen, so it never covers
// either of them.
const bar = document.querySelector<HTMLElement>("#mobile-book-bar");
const hero = document.querySelector<HTMLElement>(".hero");
const booking = document.querySelector<HTMLElement>("#booking");
const cookieBanner = document.querySelector<HTMLElement>("[data-cookie-consent]");

if (bar && hero && booking && "IntersectionObserver" in window) {
  let heroVisible = true;
  let bookingVisible = false;

  const update = () => {
    const bannerOpen = cookieBanner ? !cookieBanner.hidden : false;
    bar.hidden = heroVisible || bookingVisible || bannerOpen;
  };

  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }).observe(hero);
  new IntersectionObserver(([entry]) => { bookingVisible = entry.isIntersecting; update(); }, { rootMargin: "0px 0px -20% 0px" }).observe(booking);
  if (cookieBanner) new MutationObserver(update).observe(cookieBanner, { attributes: true, attributeFilter: ["hidden"] });
}
