export const Breakpoints = {
  Mobile: 512,
  Tablet: 768,
  Laptop: 1340,
  Desktop: 1440,
};

export const onMobile = `@media screen and (max-width: ${Breakpoints.Mobile}px)`;
export const onTablet = `@media screen and (max-width: ${Breakpoints.Tablet}px)`;
export const onLaptop = `@media screen and (max-width: ${Breakpoints.Laptop}px)`;
export const onDesktop = `@media screen and (max-width: ${Breakpoints.Desktop}px)`;
