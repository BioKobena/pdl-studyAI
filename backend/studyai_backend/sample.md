# Exemple de demande à faire à geminiAI lorsqu'on lui passera le texte en 
> Résume le texte suivant :
-  Sois concis
- Ne dépasse pas 5 phrases
- Ne copie pas mot pour mot
- Mets en avant les idées clés


> QCM : Lis le texte suivant et génère 5 questions QCM en JSON avec ce format :
            {
              "questions": [
                {
                  "question": "string",
                  "options": ["string", "string", "string", "string"],
                  "answer": "string"
                }
              ]
            }

            {
              "questions": [
                {
                  "content": "string",
                  "reponses": [{"content", "isCorrect", "isSelected (à false par defaut)"}, {"content", "isCorrect", "isSelected (à false par defaut)"}, {"content", "isCorrect", "isSelected (à false par defaut)"}, {"content", "isCorrect", "isSelected (à false par defaut)"}],
                }
              ]
            }