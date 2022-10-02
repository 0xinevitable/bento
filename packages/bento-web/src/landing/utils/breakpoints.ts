export const Breakpoints = {
  Mobile: 512,
  Tablet: 768,
  Laptop: 1340,
  Desktop: 1440,
};

export const onMobile = `@media (max-width: ${Breakpoints.Mobile}px)`;
export const onTablet = `@media (max-width: ${Breakpoints.Tablet}px)`;
export const onLaptop = `@media (max-width: ${Breakpoints.Laptop}px)`;
export const onDesktop = `@media (max-width: ${Breakpoints.Desktop}px)`;
