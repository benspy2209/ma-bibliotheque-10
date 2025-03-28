
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

  // Formulaire de nom d'utilisateur
  "username_form.title": {
    fr: "Définir votre nom d'utilisateur",
    en: "Set Your Username",
  },
  "username_form.title_modify": {
    fr: "Modifier votre nom d'utilisateur",
    en: "Modify Your Username",
  },
  "username_form.subtitle": {
    fr: "Choisissez un nom d'utilisateur unique pour votre compte.",
    en: "Choose a unique username for your account.",
  },
  "username_form.subtitle_modify": {
    fr: "Vous pouvez modifier votre nom d'utilisateur une fois par mois.",
    en: "You can modify your username once a month.",
  },
  "username_form.next_change": {
    fr: "Vous ne pouvez modifier votre nom d'utilisateur qu'une fois par mois. Prochain changement possible à partir du",
    en: "You can only change your username once a month. Next change possible from",
  },
  "username_form.label": {
    fr: "Nom d'utilisateur",
    en: "Username",
  },
  "username_form.placeholder": {
    fr: "Entrez votre nom d'utilisateur",
    en: "Enter your username",
  },
  "username_form.info": {
    fr: "Votre nom d'utilisateur sera visible par les autres utilisateurs et ne peut être modifié qu'une fois par mois.",
    en: "Your username will be visible to other users and can only be modified once a month.",
  },
  "username_form.submit": {
    fr: "Définir le nom d'utilisateur",
    en: "Set Username",
  },
  "username_form.submit_modify": {
    fr: "Modifier le nom d'utilisateur",
    en: "Modify Username",
  },
  "username_form.submitting": {
    fr: "Enregistrement...",
    en: "Saving...",
  },

  // Formulaire de compte
  "account_form.title": {
    fr: "Paramètres du compte",
    en: "Account Settings",
  },
  "account_form.subtitle": {
    fr: "Gérez les paramètres de sécurité de votre compte.",
    en: "Manage your account security settings.",
  },
  "account_form.email": {
    fr: "Adresse e-mail",
    en: "Email address",
  },
  "account_form.password": {
    fr: "Mot de passe",
    en: "Password",
  },
  "account_form.change_password": {
    fr: "Changer le mot de passe",
    en: "Change Password",
  },
  "account_form.password_dialog_title": {
    fr: "Changer le mot de passe",
    en: "Change Password",
  },
  "account_form.password_dialog_description": {
    fr: "Entrez votre mot de passe actuel et votre nouveau mot de passe.",
    en: "Enter your current password and your new password.",
  },
  "account_form.current_password": {
    fr: "Mot de passe actuel",
    en: "Current Password",
  },
  "account_form.current_password_placeholder": {
    fr: "Entrez votre mot de passe actuel",
    en: "Enter your current password",
  },
  "account_form.new_password": {
    fr: "Nouveau mot de passe",
    en: "New Password",
  },
  "account_form.new_password_placeholder": {
    fr: "Entrez un nouveau mot de passe",
    en: "Enter a new password",
  },
  "account_form.confirm_password": {
    fr: "Confirmer le mot de passe",
    en: "Confirm Password",
  },
  "account_form.confirm_password_placeholder": {
    fr: "Confirmez le nouveau mot de passe",
    en: "Confirm the new password",
  },
  "account_form.cancel": {
    fr: "Annuler",
    en: "Cancel",
  },
  "account_form.submit": {
    fr: "Modifier le mot de passe",
    en: "Change Password",
  },
  "account_form.submitting": {
    fr: "Modification...",
    en: "Changing...",
  },
  "account_form.success": {
    fr: "Mot de passe mis à jour avec succès",
    en: "Password successfully updated",
  },
};

// Obtenir une traduction
export const getTranslation = (
  key: string,
  language: "fr" | "en" = "fr"
): string => {
  const translationObj = translations[key];
  if (!translationObj) {
    console.warn(`Translation key not found: ${key}`, key);
    return key;
  }
  return translationObj[language] || translationObj["fr"] || key;
};
