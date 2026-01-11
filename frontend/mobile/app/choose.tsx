import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import LogoutButton from "@/components/ui/LogoutButton";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;
const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeScreen = SCREEN_WIDTH >= 768;
const isShortScreen = SCREEN_HEIGHT < 700;

// Fonction pour adapter les tailles de police
const scale = (size: number) => {
    if (isSmallScreen) return size * 0.9;
    if (isLargeScreen) return size * 1.1;
    return size;
};

// Fonction pour adapter les espacements
const verticalScale = (size: number) => {
    if (isSmallScreen || isShortScreen) return size * 0.75;
    if (isLargeScreen) return size * 1.15;
    return size;
};

// Fonction pour adapter les dimensions
const moderateScale = (size: number, factor = 0.5) => {
    return size + (scale(size) - size) * factor;
};

const ChooseScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { subjectId, fileName } = useLocalSearchParams<{
        subjectId: string;
        fileName?: string;
    }>();

    useEffect(() => {
        console.log("ChooseScreen subjectId:", subjectId, "fileName", fileName);
    }, [subjectId, fileName]);

    const handleGenerateQuiz = () => {
        router.replace({ pathname: "/quiz", params: { subjectId } });
    };

    const handleChat = () => {
        router.push({ pathname: "/chat", params: { subjectId } });
    };

    const handleGenerateSummary = () => {
        router.push({ pathname: "/summary", params: { subjectId, fileName } });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='dark' animated />
            <View style={[styles.logoutWrap, { top: insets.top + 8 }]}>
                <LogoutButton variant="icon" />
            </View>

            <View style={styles.backgroundPattern}>
                {[...Array(20)].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.circle,
                            {
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.3 + 0.1,
                            },
                        ]}
                    />
                ))}
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.logo}>StudyAI</Text>

                    <Text style={styles.successMessage}>
                        Votre fichier a été uploadé avec succès
                    </Text>

                    <View style={styles.robotContainer}>
                        <LottieView
                            source={require('@/assets/animations/robot.json')}
                            autoPlay
                            loop
                            style={styles.robotAnimation}
                        />
                    </View>

                    <View style={styles.pdfCard}>
                        <View style={styles.pdfIconContainer}>
                            <Image
                                source={require('@/assets/images/pdf.png')}
                                style={styles.pdfImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    <Text style={styles.optionsText}>Veuillez choisir une option :</Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleGenerateQuiz}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name="file-question-outline"
                                size={scale(24)}
                                color="#fff"
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.actionButtonText}>Générer un quiz</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleChat}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="chatbubbles-outline"
                                size={scale(24)}
                                color="#fff"
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.actionButtonText}>Chattez avec studyAI</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleGenerateSummary}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="document-text-outline"
                                size={scale(24)}
                                color="#fff"
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.actionButtonText}>Générer un résumé</Text>
                        </TouchableOpacity>
                    </View>
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
    backgroundPattern: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    },
    circle: {
        position: 'absolute',
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: '#E0E0E0',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: verticalScale(40),
    },
    content: {
        flex: 1,
        paddingHorizontal: '6%',
        paddingTop: verticalScale(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontSize: scale(28),
        fontFamily: 'Kufam-Bold',
        color: '#2C94CB',
        textAlign: 'center',
        marginBottom: verticalScale(20),
        letterSpacing: 0.5,
    },
    successMessage: {
        fontSize: scale(15),
        fontFamily: 'Kufam-SemiBold',
        color: '#333',
        textAlign: 'center',
        marginBottom: verticalScale(15),
        paddingHorizontal: '5%',
        lineHeight: scale(22),
    },
    robotContainer: {
        width: moderateScale(80),
        height: moderateScale(80),
        marginBottom: verticalScale(15),
    },
    robotAnimation: {
        width: '100%',
        height: '100%',
    },
    pdfCard: {
        backgroundColor: '#fff',
        borderRadius: verticalScale(15),
        padding: verticalScale(15),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: verticalScale(25),
        minWidth: SCREEN_WIDTH * 0.5,
        maxWidth: SCREEN_WIDTH * 0.8,
        ...Platform.select({
            android: {
                borderWidth: 1,
                borderColor: '#E0E0E0',
            },
        }),
    },
    pdfIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(10),
    },
    pdfImage: {
        width: moderateScale(100),
        height: moderateScale(100),
    },
    optionsText: {
        fontSize: scale(15),
        fontFamily: 'Kufam-SemiBold',
        color: '#333',
        marginBottom: verticalScale(20),
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '100%',
        maxWidth: 500,
        gap: verticalScale(15),
        paddingHorizontal: '2%',
    },
    actionButton: {
        backgroundColor: '#2C94CB',
        borderRadius: verticalScale(10),
        paddingVertical: verticalScale(16),
        paddingHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2C94CB',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        gap: 8,
        minHeight: verticalScale(55),
    },
    buttonIcon: {
        marginRight: 5,
    },
    actionButtonText: {
        fontSize: scale(15),
        fontFamily: 'Kufam-SemiBold',
        color: '#fff',
        letterSpacing: 0.3,
    },
    logoutWrap: {
        position: "absolute",
        right: 16,
        zIndex: 999,
    },
});

export default ChooseScreen;