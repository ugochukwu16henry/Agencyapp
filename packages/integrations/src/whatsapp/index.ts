export const buildWhatsappMessage = (phone: string, propertyTitle: string) => {
  const message = encodeURIComponent(
    `Hello, I am interested in ${propertyTitle}. Can we schedule a visit?`,
  );

  return `https://wa.me/${phone}?text=${message}`;
};
