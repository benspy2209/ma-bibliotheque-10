
type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

// Dictionnaire de traductions
export const translations: Translations = {
  // Page des paramètres de profil
  "profile_settings.title": {
    fr: "Paramètres du profil",
    en: "Profile Settings",
  },
  "profile_settings.subtitle": {
    fr: "Gérez vos informations personnelles et vos préférences.",
    en: "Manage your personal information and preferences.",
  },
  "profile_settings.tab.username": {
    fr: "Nom d'utilisateur",
    en: "Username",
  },
  "profile_settings.tab.personal_info": {
    fr: "Informations personnelles",
    en: "Personal Information",
  },
  "profile_settings.tab.reading": {
    fr: "Préférences de lecture",
    en: "Reading Preferences",
  },
  "profile_settings.tab.interface": {
    fr: "Interface",
    en: "Interface",
  },
  "profile_settings.tab.account": {
    fr: "Compte",
    en: "Account",
  },

  // Formulaire d'informations personnelles
  "profile_form.title": {
    fr: "Informations personnelles",
    en: "Personal Information",
  },
  "profile_form.subtitle": {
    fr: "Modifiez vos informations personnelles qui seront affichées sur votre profil.",
    en: "Edit your personal information that will be displayed on your profile.",
  },
  "profile_form.full_name": {
    fr: "Nom complet",
    en: "Full Name",
  },
  "profile_form.full_name_description": {
    fr: "Ce nom sera utilisé pour vous identifier sur votre profil.",
    en: "This name will be used to identify you on your profile.",
  },
  "profile_form.bio": {
    fr: "Biographie",
    en: "Biography",
  },
  "profile_form.location": {
    fr: "Localisation",
    en: "Location",
  },
  "profile_form.website": {
    fr: "Site web",
    en: "Website",
  },
  "profile_form.save": {
    fr: "Enregistrer les modifications",
    en: "Save Changes",
  },
  "profile_form.saving": {
    fr: "Enregistrement...",
    en: "Saving...",
  },

  // Formulaire de préférences d'interface
  "interface_form.title": {
    fr: "Personnalisation de l'interface",
    en: "Interface Customization",
  },
  "interface_form.subtitle": {
    fr: "Modifiez l'apparence et la langue de l'application.",
    en: "Change the appearance and language of the application.",
  },
  "interface_form.theme": {
    fr: "Thème",
    en: "Theme",
  },
  "interface_form.theme_description": {
    fr: "Choisissez le thème qui vous convient le mieux.",
    en: "Choose the theme that suits you best.",
  },
  "interface_form.theme_light": {
    fr: "Clair",
    en: "Light",
  },
  "interface_form.theme_dark": {
    fr: "Sombre",
    en: "Dark",
  },
  "interface_form.language": {
    fr: "Langue",
    en: "Language",
  },
  "interface_form.language_description": {
    fr: "La langue de l'interface utilisateur.",
    en: "The language of the user interface.",
  },
  "interface_form.save": {
    fr: "Enregistrer les préférences",
    en: "Save Preferences",
  },
  "interface_form.saving": {
    fr: "Enregistrement...",
    en: "Saving...",
  },

  // Toasts de notification
  "toast.profile_updated": {
    fr: "Informations du profil mises à jour avec succès!",
    en: "Profile information successfully updated!",
  },
  "toast.preferences_updated": {
    fr: "Préférences d'interface mises à jour avec succès!",
    en: "Interface preferences successfully updated!",
  },
  "toast.error": {
    fr: "Une erreur est survenue lors de la mise à jour.",
    en: "An error occurred during the update.",
  },
};

// Obtenir une traduction
export const getTranslation = (
  key: string,
  language: "fr" | "en" = "fr"
): string => {
  const translationObj = translations[key];
  if (!translationObj) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  return translationObj[language] || translationObj["fr"] || key;
};
