# INSTALLATION — StudyAI 

Ce document explique comment préparer l'environnement et lancer les différents composants du projet StudyAI (backend, frontend web, mobile) en local ou avec Docker. Les commandes ci‑dessous sont fournies pour Windows (PowerShell) mais sont similaires sur macOS / Linux.

---

## Prérequis

- Java 17 (JDK)
- Maven (ou le wrapper `mvnw` / `mvnw.cmd` fourni)
- Node.js (version LTS) et npm
- Expo CLI (optionnel, pour mobile) : `npm install -g expo-cli` ou `npx expo` pour usage ponctuel
- Docker & docker-compose (optionnel, pour exécuter backend + Mongo)
- (Optionnel) MongoDB local ou un cluster MongoDB Atlas

---

## Variables d'environnement utiles

Créez un fichier `.env` ou exportez ces variables avant de lancer les services :

```env
# Backend
MONGO_URI=mongodb://localhost:27017/studyai
PORT=8080
# (Ne pas mettre de credentials en clair dans le repo)
```

---

## Backend — exécution locale

1. Ouvrir PowerShell et se placer dans le dossier backend :

```powershell
cd .\backend\studyai_backend
```

2. (Optionnel) Si vous utilisez le wrapper Maven fourni (Windows) :

```powershell
.\mvnw.cmd clean package
.\mvnw.cmd spring-boot:run
```

3. Avec Maven installé globalement :

```powershell
mvn clean package
mvn spring-boot:run
```

4. L'application écoute par défaut sur `http://localhost:8085` (ou sur le port défini via la variable `PORT`).

5. Vérifier la doc OpenAPI/Swagger : `http://localhost:8085/swagger-ui`

---

## Backend — exécution avec Docker

1. Se placer dans le répertoire contenant le `docker-compose.yml` :

```powershell
cd .\backend\studyai_backend
```

2. Lancer les services :

```powershell
docker-compose up --build -d
```

3. Arrêter et supprimer les conteneurs :

```powershell
docker-compose down
```

---

## Frontend web (Next.js)

1. Se placer dans :

```powershell
cd .\frontend\web
```

2. Installer les dépendances et lancer le serveur de développement :

```powershell
npm install
npm run dev
```

3. Ouvrir : `http://localhost:3000`

4. Lint : `npm run lint`

---

## Mobile (Expo)

1. Se placer dans :

```powershell
cd .\frontend\mobile
```

2. Installer et lancer :

```powershell
npm install
npx expo start
```

3. Suivre les instructions Expo pour ouvrir sur un simulateur ou un appareil (Expo Go).

---

## Tests & qualité

- Backend : ajouter et lancer les tests via Maven (`mvn test`).
- Frontend : vérifier le lint (voir script `npm run lint`).

---

## Dépannage (quick tips)

- Port occupé : vérifier quel processus écoute (`netstat -ano | findstr 8085`) et tuer si nécessaire.
- Erreurs Mongo : assurez-vous que `MONGO_URI` pointe vers une instance accessible (local ou Atlas).
- Variables manquantes : vérifier `.env` et redémarrer les services.

---

## Bonnes pratiques & sécurité

- **Ne commitez jamais** les identifiants ou secrets en clair (mot de passe, URI avec credentials). Utilisez des variables d'environnement ou un secret manager.
- Révoquez les credentials exposés et régénérez-les si des secrets ont été trouvés dans le repo.

---

## Prochaines étapes recommandées

- Ajouter un script de démarrage global (root `Makefile` ou scripts npm) pour automatiser le lancement multi‑services.
- Ajouter une documentation CI (GitHub Actions) pour build/test/docker.
