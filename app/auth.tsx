import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const {width} = Dimensions.get("window");

export default function AuthScreen() {
    const [hasBiometrics, setHasBiometrics] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkBiometrics();
    }, []);
    const checkBiometrics = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setHasBiometrics(hasHardware && isEnrolled);
    }; 

    const authenticate = async () => {
        try {
            setIsAuthenticating(true);
            setError(null);

            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            const supportedTypes = 
                await LocalAuthentication.supportedAuthenticationTypesAsync();
            // handle supportedtypes
            const auth = await LocalAuthentication.authenticateAsync({
                promptMessage: hasHardware && isEnrolled 
                    ? 'Masukkan faceID/TouchID'
                    : 'Masukkan PIN',
                fallbackLabel: 'Gunakan PIN',
                cancelLabel: 'Batalkan',
                disableDeviceFallback: false,
            });

            if (auth.success) {
               router.replace("/home");
            }else {
                setError('Authentication failed. Please try again.');
            }
        } catch (error) {}
    };

    return (
        <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="medical" size={80} color="white"/>
                </View>
                <Text style={styles.title}>
                    RutinMedis
                </Text>
                <Text style={styles.subtitle}>
                   Teman Setia Jadwal Obat Anda
                </Text>

                <View style={styles.card}>
                    <Text style= {styles.welcomeText}>
                        Hallo Teman Sehat!
                    </Text>
                    <Text style={styles.instruksiText}>
                        {hasBiometrics 
                        ? "Use face ID/TouchID or PIN to access your medications"
                        : "Enter your PIN"}
                    </Text>
                    <TouchableOpacity 
                        style={[styles.button, isAuthenticating && styles.buttonDisabled]}
                        onPress={authenticate}
                        disabled={isAuthenticating}
                    >
                        <Ionicons
                            name={hasBiometrics ?
                                'finger-print-outline':'keypad-outline'
                            }
                            size={24}
                            color="white"
                            style={styles.buttonIcon}
                        />
                        <Text
                        style={styles.buttonText}
                        >
                            {isAuthenticating  
                            ? 'Verifying...' 
                            : hasBiometrics 
                            ? 'Authenticate'
                            : 'Enter PIN'}
                        </Text>
                    </TouchableOpacity>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={20} color={'#f44336'}/>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        width: 120,
        height: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 40,
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        width: width - 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { 
            width: 0,
            height: 2 
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    instruksiText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },           
    errorContainer: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#ffebee',
        borderRadius: 8,
    },
    errorText: {
        color: '#f44336',
        fontSize: 14,
        marginLeft: 8,
        textAlign: 'center',
    },  
});