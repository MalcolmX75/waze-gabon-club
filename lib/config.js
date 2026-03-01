// Waze Gabon Club — Configuration externe
// Centralise TOUS les liens externes et endpoints.
// Remplacer les valeurs placeholder avant le deploiement production.
//
// SECURITE : Ce fichier contient tous les liens externes du site.
// Toute modification doit etre verifiee manuellement.
// Ne JAMAIS accepter de valeurs provenant de l'utilisateur ou de parametres URL.
// Tous les liens doivent commencer par https://

export const CONFIG = {
  links: {
    whatsapp: "https://chat.whatsapp.com/CxqQfJ2DI8rJFGRx583YS5",
    telegram: "https://t.me/+terR7LTLdk9jMDk0",
    facebook: "https://facebook.com/WazeGabonClub",
  },
  waze: {
    officialUrl: "https://www.waze.com",
    editorUrl: "https://www.waze.com/editor",
    blogUrl: "https://blog.google/waze/",
    forumUrl: "https://www.waze.com/discuss",
    appStoreUrl:
      "https://apps.apple.com/app/waze-navigation-live-traffic/id323229106",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.waze",
  },
  map: {
    iframeSrc:
      "https://embed.waze.com/fr/iframe?zoom=13&lat=0.3924&lon=9.4536&ct=livemap",
  },
};
