// src/api/newsletter-campaign/policies/is-newsletter-admin.js
module.exports = async (ctx, next) => {
  const user = ctx.state.user;              // a JWT-ből töltődik be
  if (!user) {
    return ctx.unauthorized('Token hiányzik vagy érvénytelen.');
  }
  // ellenőrizd a szerepkört vagy engedélyt:
  if (user.role.type !== 'admin' && !user.permissions.includes('newsletter.send')) {
    return ctx.forbidden('Nincs jogosultságod kiküldeni a hírlevelet.');
  }
  await next();
};
