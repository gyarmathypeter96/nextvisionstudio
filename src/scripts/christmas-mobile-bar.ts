// Mobile "Book" bar: appears once the hero's own buttons scroll away and hides
// while the booking form is on screen. While the slim cookie bar is open, the
// Book bar and the floating WhatsApp button sit just above it.
const bar = document.querySelector<HTMLElement>("#mobile-book-bar");
const hero = document.querySelector<HTMLElement>(".hero");
const booking = document.querySelector<HTMLElement>("#booking");
const cookieBanner = document.querySelector<HTMLElement>("[data-cookie-consent]");

if (bar && hero && booking && "IntersectionObserver" in window) {
  let heroVisible = true;
  let bookingVisible = false;

  const update = () => {
    const bannerOpen = cookieBanner ? !cookieBanner.hidden : false;
    // Shared with the floating WhatsApp button so neither covers the cookie bar.
    document.documentElement.style.setProperty("--cookie-offset", bannerOpen && cookieBanner ? `${cookieBanner.offsetHeight}px` : "0px");
    bar.hidden = heroVisible || bookingVisible;
  };

  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }).observe(hero);
  new IntersectionObserver(([entry]) => { bookingVisible = entry.isIntersecting; update(); }, { rootMargin: "0px 0px -20% 0px" }).observe(booking);
  if (cookieBanner) new MutationObserver(update).observe(cookieBanner, { attributes: true, attributeFilter: ["hidden"] });
  window.addEventListener("resize", update);
}
