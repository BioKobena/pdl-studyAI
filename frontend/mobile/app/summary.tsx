import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { resumeText } from '@/api/resume';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;
const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeScreen = SCREEN_WIDTH >= 768;

// Fonction pour adapter les tailles de police
const scale = (size: number) => {
  if (isSmallScreen) return size * 0.9;
  if (isLargeScreen) return size * 1.1;
  return size;
};

// Fonction pour adapter les espacements
const verticalScale = (size: number) => {
  if (isSmallScreen) return size * 0.85;
  if (isLargeScreen) return size * 1.15;
  return size;
};

// Fonction pour adapter les dimensions
const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const ResumeScreen = () => {
  const router = useRouter();
  const { subjectId, fileName } = useLocalSearchParams<{ subjectId: string, fileName: string }>();
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<{ texteResume?: string } | null>(null);

  const handleGenerateResume = async () => {
    if (!subjectId) {
      Alert.alert("Erreur", "SubjectId Manquant");
      return;
    }
    try {
      setLoading(true);
      const data = await resumeText(subjectId);
      console.log("RESUME RAW =", JSON.stringify(data, null, 2));
      const resumeObj = data?.resume ?? data;
      console.log("RESUME OBJ =", JSON.stringify(resumeObj, null, 2));
      setResume({ texteResume: resumeObj.texteResume ?? resumeObj.content ?? "" });
    } catch (e: any) {
      Alert.alert("Erreur", e?.message ?? "Erreur résumé");
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    router.push({ pathname: "/chat", params: { subjectId } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={scale(25)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Résumé de votre cours</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!resume ? (
          <View style={styles.pdfContainer}>
            <View style={styles.pdfBox}>
              <Image
                source={require('@/assets/images/pdf.png')}
                style={styles.pdfImage}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              style={[styles.actionButton, loading && styles.actionButtonDisabled]}
              onPress={handleGenerateResume}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>
                {loading ? "Génération..." : "Générer mon résumé"}
              </Text>
              {!loading && (
                <Ionicons name="sparkles" size={scale(20)} color="#fff" style={styles.buttonIcon} />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectLabel}>Sujet :</Text>
                <Text style={styles.subjectText} numberOfLines={2}>
                  {fileName || "Document"}
                </Text>
              </View>

              <ScrollView
                style={styles.summaryContent}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.summaryText}>
                  {resume?.texteResume || "Résumé introuvable"}
                </Text>
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleStartChat}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Commencer un chat</Text>
              <Ionicons name="chatbubbles" size={scale(20)} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
    minHeight: verticalScale(60),
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: scale(18),
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  headerSpacer: {
    width: scale(25) + 16, // Taille du bouton retour pour centrer le titre
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: '5%',
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(30),
    minHeight: SCREEN_HEIGHT * 0.6,
  },
  pdfBox: {
    width: SCREEN_WIDTH * 0.7,
    maxWidth: 280,
    height: SCREEN_HEIGHT * 0.4,
    maxHeight: 360,
    backgroundColor: '#E3F2FD',
    borderRadius: verticalScale(15),
    borderWidth: 2,
    borderColor: '#2C94CB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  pdfImage: {
    width: moderateScale(120),
    height: moderateScale(120),
  },
  contentContainer: {
    flex: 1,
    paddingBottom: verticalScale(20),
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: verticalScale(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: '5%',
    marginBottom: verticalScale(25),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    maxHeight: SCREEN_HEIGHT * 0.65,
    ...Platform.select({
      android: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
      },
    }),
  },
  subjectHeader: {
    flexDirection: 'row',
    marginBottom: verticalScale(15),
    paddingBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'flex-start',
  },
  subjectLabel: {
    fontSize: scale(15),
    fontFamily: 'Kufam-Bold',
    color: '#000',
    marginRight: 8,
  },
  subjectText: {
    fontSize: scale(15),
    fontFamily: 'Kufam-Regular',
    color: '#333',
    flex: 1,
    lineHeight: scale(21),
  },
  summaryContent: {
    flex: 1,
  },
  summaryText: {
    fontSize: scale(14),
    fontFamily: 'Kufam-Regular',
    color: '#666',
    lineHeight: scale(22),
  },
  actionButton: {
    backgroundColor: '#F9690E',
    borderRadius: verticalScale(10),
    paddingVertical: verticalScale(16),
    paddingHorizontal: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F9690E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: verticalScale(55),
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: scale(16),
    fontFamily: 'Kufam-Bold',
    color: '#fff',
    letterSpacing: 0.3,
  },
});

export default ResumeScreen;