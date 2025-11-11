# ATECOLOGIE

Site vitrine pour l'agence ATECOLOGIE présentant les prestations de création de site web,
dépannage informatique et création graphique, avec un formulaire de prise de rendez-vous.

## Structure du projet

- `index.html` : page principale avec les sections Services, Méthode, Avis et réservation.
- `styles.css` : styles principaux utilisant une palette bleu & blanc.
- `script.js` : interactions (mise à jour du récapitulatif des services, validation du formulaire, bouton retour en haut, envoi vers l'automatisation externe).
- `config.js` : point de configuration du formulaire pour indiquer l'URL du service distant (Google Apps Script par exemple).

## Utilisation

Ouvrez simplement `index.html` dans votre navigateur pour visualiser le site. Aucun serveur ou dépendance n'est requis.

## Activer l'envoi d'emails et l'ajout automatique au calendrier

Le formulaire envoie désormais les informations vers l'URL définie dans `config.js`. Pour que
l'email soit expédié à `mywebsitescreators@gmail.com` et qu'un événement soit créé dans le
calendrier Google associé, vous pouvez utiliser un Google Apps Script déployé en tant qu'application
web.

### 1. Créer le script Google

1. Rendez-vous sur [script.google.com](https://script.google.com) et créez un nouveau projet.
2. Remplacez le contenu par le script suivant :

   ```js
   const RECIPIENT = 'mywebsitescreators@gmail.com';

   function doPost(e) {
     const payload = JSON.parse(e.postData.contents);

     const calendar = CalendarApp.getDefaultCalendar();
     const start = new Date(`${payload.date}T${payload.time}:00`);
     const end = new Date(start.getTime() + 60 * 60 * 1000); // Durée par défaut : 1h
     const event = calendar.createEvent(
       `${payload.serviceLabel || 'Rendez-vous'} – ${payload.name}`,
       start,
       end
     );

     const emailBody = `Nom : ${payload.name}\nEmail : ${payload.email}\nTéléphone : ${payload.phone}\nPrestation : ${payload.serviceLabel}\nDate : ${payload.date}\nHeure : ${payload.time}\nMessage : ${payload.message || '—'}`;
     GmailApp.sendEmail(RECIPIENT, 'Nouveau rendez-vous ATECOLOGIE', emailBody, {
       replyTo: payload.email,
     });

     return ContentService.createTextOutput(
       JSON.stringify({ message: 'Merci ! Votre rendez-vous a bien été enregistré.' })
     ).setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. Cliquez sur **Déployer > Nouveau déploiement**, choisissez **Application web**, sélectionnez
   « Toute personne disposant du lien » dans *Qui a accès*, puis copiez l'URL du déploiement.

### 2. Configurer le site

Dans `config.js`, remplacez `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` par l'URL obtenue lors du
déploiement (conservez les guillemets). Lors de la soumission, le script enverra les données en
JSON à cet endpoint, déclenchant l'envoi de l'email et la création de l'événement.

> ℹ️  Les navigateurs exigent que le déploiement accepte les requêtes cross-origin (CORS). Si vous
> obtenez une erreur liée à l'origine, ajoutez `return ContentService.createTextOutput(...)` comme
> ci-dessus et vérifiez que « Exécuter en tant que » est réglé sur « Moi ».
