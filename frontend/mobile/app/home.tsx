import React, { useCallback,useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { storage } from '@/api/storage/token';
import { listeSubjectUser } from '@/api/subject';
import { useFocusEffect } from '@react-navigation/native';
import LogoutButton from "@/components/ui/LogoutButton";


interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "success" | "error" | "pending";
  uri?: string;
}

const UploadScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  useEffect(() => {
    let alive = true;
      
    (async () => {
      try {
        setLoadingSubjects(true);

        const user = await storage.getUser<{ id: string }>();
        if (!user?.id) throw new Error("Utilisateur non trouvé");
        

          // 1) afficher cache immédiatement (si dispo)
          const cached = await storage.getCachedSubjects(user?.id);
          if (cached.length > 0) {
            setUploadedFiles(prev => {
              // on garde aussi les fichiers "pending" (pickés mais pas encore créés)
              const pending = prev.filter(f => f.status === "pending");
              const cachedMapped: UploadedFile[] = cached.map(s => ({
                id: s.id,
                subjectId: s.id,         // rai subjectId
                name: s.title,
                size: "-",
                status: "success",
              }));
              return [...pending, ...cachedMapped];
            });
          }

        const subjects = await listeSubjectUser(user.id);

        // Si l’API renvoie vide, on n’écrase pas ce qu’on a (cache/pending)
      if (!Array.isArray(subjects) || subjects.length === 0) return;

      const apiMapped: UploadedFile[] = subjects.map(s => ({
        id: s.id,
        subjectId: s.id,            // vrai subjectId
        name: s.title,
        size: "-",
        status: "success",
      }));

      setUploadedFiles(prev => {
        const pending = prev.filter(f => f.status === "pending");
        return [...pending, ...apiMapped];
      });

      // 3) update cache
      await storage.setCachedSubjects(
        user?.id,
        subjects.map(s => ({ id: s.id, userId: s.userId, title: s.title }))
      );
      } finally {
        if (!alive) return;
        setLoadingSubjects(false);
      }
    })();
    
    console.log("uploadedFiles state =", uploadedFiles.length);

    return () => {
      alive = false;
    };
  }, []);

  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileSizeMB = ((file.size || 0) / (1024 * 1024)).toFixed(2);
        
        if ((file.size || 0) > 20 * 1024 * 1024) {
          Alert.alert('Erreur', 'Le fichier est trop volumineux. Maximum 20 Mo.');
          return;
        }

        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          size: `${fileSizeMB} Mo`,
          status: 'success',
          uri: file.uri,
        };

        setUploadedFiles([newFile, ...uploadedFiles]);
        setSelectedFile(newFile);
        
        router.push({
          pathname: "/loading",
          params: {
            fileName: file.name,
            fileSize: `${fileSizeMB} Mo`,
            fileUri: file.uri,
          },
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection du fichier.');
    }
  };

  const removeFile = (id: string) => {
    Alert.alert(
      'Supprimer le fichier',
      'Êtes-vous sûr de vouloir supprimer ce fichier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
            if (selectedFile?.id === id) {
              setSelectedFile(null);
            }
          },
        },
      ]
    );
  };

  const handleFileSelect = (file: UploadedFile) => {
    if (file.status === 'success') {
      setSelectedFile(file);
        //si c'est un ancien subject (pas d'uri), on va direct à Choose
        if (!file.uri) {
          router.push({
            pathname: "/choose",
            params: {
              subjectId: file.id,     // ici id = subjectId
              fileName: file.name,
            },
          });
          return;
        }

      router.push({
        pathname: "/loading",
        params: {
          fileName: file.name,
          fileSize: file.size,
          fileUri: file.uri || '',
        },
      });
    } else {
      Alert.alert('Erreur', 'Ce fichier n\'a pas été téléchargé correctement.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='dark' animated />
      <View style={[styles.logoutWrap, { top: insets.top + 8 }]}>
        <LogoutButton variant="icon" />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Bienvenue,</Text>
          <Text style={styles.instructionText}>Veuillez choisir le fichier à analyser</Text>
        </View>

        <TouchableOpacity 
          style={styles.uploadBox}
          onPress={pickDocument}
          activeOpacity={0.7}
        >
          <Text style={styles.uploadTitle}>Téléchargez votre fichier</Text>
          <Text style={styles.uploadSubtitle}>PDF, DOC, DOCX, DOCS jusqu'à 20 Mo</Text>
          
          <View style={styles.uploadIconContainer}>
            <Ionicons name="cloud-upload-outline" size={60} color="#2C94CB" />
          </View>
        </TouchableOpacity>

        <View style={styles.filesSection}>
          <Text style={styles.filesSectionTitle}>Fichiers récemment téléchargés</Text>
          {loadingSubjects && (
            <Text style={{ color: "#666", marginBottom: 10 }}>Chargement…</Text>
          )}

          {uploadedFiles.map((file) => (
            <TouchableOpacity
              key={file.id}
              style={[
                styles.fileItem,
                selectedFile?.id === file.id && styles.fileItemSelected,
              ]}
              onPress={() => handleFileSelect(file)}
              activeOpacity={0.7}
            >
              <View style={styles.fileLeft}>
                {file.status === 'success' ? (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                ) : (
                  <Ionicons name="close-circle" size={24} color="#F44336" />
                )}
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
              </View>
              
              <View style={styles.fileRight}>
                <Text style={styles.fileSize}>{file.size}</Text>
                <TouchableOpacity 
                  onPress={() => removeFile(file.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'Kufam-SemiBold',
    color: '#000',
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Kufam-Regular',
    color: '#000',
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#2C94CB',
    borderStyle: 'dashed',
    borderRadius: 15,
    backgroundColor: '#E3F2FD',
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  uploadTitle: {
    fontSize: 18,
    fontFamily: 'Kufam-SemiBold',
    color: '#2C94CB',
    marginBottom: 10,
  },
  uploadSubtitle: {
    fontSize: 13,
    fontFamily: 'Kufam-Regular',
    color: '#666',
    marginBottom: 20,
  },
  uploadIconContainer: {
    marginTop: 10,
  },
  filesSection: {
    flex: 1,
  },
  filesSectionTitle: {
    fontSize: 15,
    fontFamily: 'Kufam-Regular',
    color: '#666',
    marginBottom: 15,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fileItemSelected: {
    borderColor: '#2C94CB',
    borderWidth: 2,
    backgroundColor: '#E3F2FD',
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'Kufam-Regular',
    color: '#000',
    marginLeft: 12,
    flex: 1,
  },
  fileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  fileSize: {
    fontSize: 13,
    fontFamily: 'Kufam-Regular',
    color: '#F9690E',
  },
  logoutWrap: {
  position: "absolute",
  right: 16,
  zIndex: 999,
},

});

export default UploadScreen;