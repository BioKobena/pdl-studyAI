# Architecture & Design

## 1. Introduction

Ce document décrit l’architecture logicielle du projet. Il a pour objectif de permettre à tout nouveau contributeur de comprendre rapidement la structure du système, ses entités principales et leurs interactions.

L’application permet à un utilisateur de créer des sujets
(Subject) pouvant être de type Quiz, Résumé ou Chat.

## 2. Vue d’ensemble de l’architecture

L’architecture repose sur un modèle orienté objet. Chaque fonctionnalité principale (Quiz, Résumé, Chat) est rattachée à un Subject, lui-même lié à un User.

Les données sont organisées autour des entités suivantes :
- User
- Subject
- Quiz
- Question
- Response
- Resume
- Chat
- Message

## 3. Modèle statique

Le diagramme de classes UML ci-dessous représente les relations entre les entités principales du système.

- Un User peut posséder plusieurs Subjects
- Un Subject peut être associé à un Quiz, un Resume ou un Chat
- Un Quiz contient plusieurs Questions
- Une Question possède plusieurs Responses dont une ou plusieurs peuvent êtres correcte

![Diagramme de cas d'utilisation](docs/diagramme-cas-utilisations.png)
![Diagramme de classes](docs/diagramme-classes.png)
![Diagramme de séquence](docs/diagramme-sequence.png)

## 4. Description des entités
### User
Représente un utilisateur de l’application.

Attributs :
- id : identifiant unique
- fullName : nom complet
- email : adresse email
- password : mot de passe hashé

Responsabilité :
- Créer et gérer ses sujets (Subject)
