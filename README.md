# StudyAI 

**Outil d’aide à la révision (web & mobile) basé sur l’IA**  
StudyAI facilite la révision en extrayant, résumant et générant des quiz à partir de documents (PDF, Word, TXT), et propose un chat contextuel alimenté par les contenus uploadés.

## Auteurs

Projet réalisé par :

- Bio Paul KOBENA
- Eunice OYOTODE
- Marlene GOHI
- Fulbert SOSSA
- Evrard KONAN
- Michele Anaïs

## Table des matières
1. [Contexte & objectifs](#contexte--objectifs)  
2. [Fonctionnalités principales](#fonctionnalités-principales)  
3. [Architecture & stack technique](#architecture--stack-technique)  
4. [Installation & exécution](#installation--exécution)  
5. [API & documentation](#api--documentation)  
6. [Aspects IA](#aspects-ia)  
7. [Sécurité](#sécurité)  
8. [Planning & livrables](#planning--livrables)  
9. [Contribuer](#contribuer)  
10. [Licence & contact](#licence--contact)

---

## Contexte & objectifs
Dans le cadre du Master 1 MIAGE (promo 2025‑2026), StudyAI vise à automatiser la synthèse de cours et la génération de quiz afin d’aider les étudiants à réviser plus efficacement.  
Objectifs clés :
- Upload de fichiers de cours (PDF, Word, TXT).
- Extraction et synthèse du contenu (résumés, QCM).
- Chat IA contextuel basé sur le fichier uploadé.
- Interfaces web et mobile modernes, avec authentification sécurisée.

---

## Fonctionnalités principales
- Connexion / Inscription (email / mot de passe)
- Upload de fichier (PDF, Word, TXT)
- Extraction de texte (outil d’extraction comme Apache Tika)
- Génération de résumé structuré
- Génération de QCM (5–10 questions)
- Chat IA contextuel sur le fichier uploadé
- Historique des fichiers et des résultats

---

## Architecture & stack technique
Architecture 3‑tiers : Frontend ↔ Backend ↔ Base de données, plus intégration d’une API IA externe.

- Backend : Java 17, Spring Boot, Spring Security, Spring Data (MongoDB)
- Frontend web : Next.js (React)
- Mobile : Expo / React Native
- IA envisagée : *Gemini* / OpenAI / alternatives
- Conteneurisation : Docker, docker-compose

### Structure du projet

Structure du projet :

```text
StudyAI
├── backend
│   └── studyai_backend
├── frontend
│   ├── web
│   └── mobile
└── README.md
```

### Technologies utilisées

| Technologie | Description |
|------------|-------------|
| Java 17 | Langage de programmation |
| Spring Boot | Framework backend |
| Spring Security | Sécurisation de l’application |
| JWT | Authentification stateless |
| MongoDB | Base de données NoSQL |
| Spring Data MongoDB | Accès aux données |
| Swagger / OpenAPI | Documentation de l’API |
| Maven | Gestion des dépendances |
| Docker | Conteneurisation (optionnelle) |

---

## Installation & exécution 

Prérequis : JDK 17, Maven, Node.js (LTS), npm, Expo CLI (optionnel), Docker (optionnel).

**Backend (local)**
- cd `backend/studyai_backend`
- `mvn clean package`
- `mvn spring-boot:run` (ou `PORT=8080 mvn spring-boot:run`)

**Backend (Docker)**
- cd `backend/studyai_backend`
- `docker-compose up --build -d` (services : app + mongo)

**Frontend web**
- cd `frontend/web`
- `npm install`
- `npm run dev` → http://localhost:3000

**Mobile (Expo)**
- cd `frontend/mobile`
- `npm install`
- `npx expo start`

---

## API & documentation 
- Documentation OpenAPI / Swagger : `http://localhost:{PORT}/swagger-ui`
- OpenAPI JSON : `/api-docs`

---

## Aspects IA
- Résumé : entrée = texte du cours → sortie = résumé structuré (GPT‑4 / Gemini envisagés)
- Quiz : génération automatique de QCM (10 questions)
- Chat : réponses contextuelles basées sur le contenu uploadé
- Une couche d’abstraction pour pouvoir changer de fournisseur IA facilement.

---

## Sécurité 
- Authentification prévue via JWT.
- Uploads sécurisés : vérification MIME, limites de taille, validation.
- Communication HTTPS en production.
- **Conseil :** supprimer toute donnée sensible commitée (credentials) et utiliser des variables d’environnement / secret manager.

---

## Planning & livrables 
Exemple (4–6 semaines) :
- S1 : Analyse & conception, choix API IA
- S2 : Backend + MongoDB (fonctionnel)
- S3 : Intégration IA (résumés + quiz)
- S4 : Frontend web (pages principales)
- S5 : Connexion front/back + tests utilisateurs
- S6 : Déploiement & documentation finale

Livrables : code source, rapport technique, documentation Swagger, présentation/démo.

---

## Contribuer 
- Fork → feature branch → PR → review
- Respecter lint/tests et inclure une description claire des PR

---

## Licence & contact
- Licence : à définir (ajouter `LICENSE`)
- Contact / support : ouvrir une issue

L’application développée, nommée **StudyAI**, vise à assister les étudiants dans leurs révisions grâce à l’intelligence artificielle.  
Elle permet notamment l’analyse de documents pédagogiques et la génération automatique de contenus pédagogiques tels que des résumés, des quiz et des réponses interactives.

Ce dépôt contient **l’implémentation complète de la partie backend** de l’application.

---
