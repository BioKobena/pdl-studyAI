import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { storage } from '@/api/storage/token';
import { sendChatMessageMobile } from '@/api/chat';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const INITIAL_SUGGESTIONS = [
  "Explique-moi les points clés",
  "Résume ce document",
  "Quelles sont les idées principales ?",
  "Donne-moi des exemples",
];

const FOLLOW_UP_SUGGESTIONS = [
  "Peux-tu développer ?",
  "Donne-moi plus de détails",
  "Explique autrement",
  "C'est quoi la conclusion ?",
];

const ChatScreen = () => {
  const {subjectId} = useLocalSearchParams<{subjectId:string}>();
  const [sending, setSending]=useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const getCurrentSuggestions = () => {
    return messages.length === 0 ? INITIAL_SUGGESTIONS : FOLLOW_UP_SUGGESTIONS;
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
    // Envoyer directement le message après un court délai
    setTimeout(() => {
      handleSendWithText(suggestion);
    }, 100);
  };

  const handleSendWithText = async(text: string) => {
    const trimmedText = text.trim();
    if(!trimmedText || sending) return;

    if(!subjectId){
      Alert.alert("Erreur","subjectid Manquant. Reviens à l'étape précédante.");
      return
    }
    //ajoute le message de l'utilisateur 
    const userMsg:Message={
      id: Date.now().toString(),
      text: trimmedText,
      isUser:true,
      timestamp:new Date(),
    };    
   //ajoute le message en cours
   const botId = (Date.now()+1).toString();
   const pendingBot:Message={
      id:botId,
      text:"...",
      isUser:false,
      timestamp:new Date(),
    
   };
    setMessages(prev => [...prev, userMsg, pendingBot]);
    setInputText("");
    try{
      setSending(true);
      //recupère l'id du user

      const user = await storage.getUser<{id:string}>();
      if(!user?.id) throw new Error ("Utilisateur non trouvé");
      //On appelle maintenant l'API 
      const res = await sendChatMessageMobile({
        userId:user.id,
        subjectId,
        message:trimmedText,

      });

      //On remplace maintenant le bot par la vraie reponse 

      setMessages(prev =>
          prev.map(m => (m.id === botId ? { ...m, text: res.message ?? "Réponse vide" } : m))
      );   

    }catch(e:any){
      const msg = e?.message ?? "Erreur IA";
            setMessages(prev=>
              prev.map(m=>
                (m.id ===botId? {...m, text:`Erreur: ${String(msg)}`}
              :m)
            ));
 
    }finally{
      setSending(false);
    }
  };

  const handleSend = async() => {
    const text = inputText.trim();
    if(!text || sending) return;
    await handleSendWithText(text);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.botMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={[styles.messageText, item.isUser && styles.userMessageText]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.circle,
              {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.2 + 0.05,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>studyAI chat</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Suggestions au-dessus de l'input */}
        {isInputFocused && (
          <View style={styles.suggestionsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsScroll}
              keyboardShouldPersistTaps="handled"
            >
              {getCurrentSuggestions().map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestionPress(suggestion)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="bulb-outline" size={16} color="#2C94CB" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Posez votre question..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <Ionicons name="hourglass-outline" size={22} color="#999" />
            ) : (
              <Ionicons 
                name="send" 
                size={22} 
                color={inputText.trim() ? "#2C94CB" : "#999"} 
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  circle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#2C94CB',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#4A5568',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Kufam-Regular',
    color: '#fff',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  suggestionsContainer: {
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 12,
  },
  suggestionsScroll: {
    paddingHorizontal: 15,
    gap: 10,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C94CB',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Kufam-Medium',
    color: '#2C94CB',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 15,
    fontFamily: 'Kufam-Regular',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
});

export default ChatScreen;