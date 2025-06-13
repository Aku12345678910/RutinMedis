import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
const {width} = Dimensions.get("window");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const QUICK_ACTIONS = [
    {
      icon: "add-circle-outline" as const,
      label: "Add\nMedication",
      route: "/medication/add" as const,
      color: "#2E7D32",
      gradient: ["#4CAF50", "#2E7D32"] as [string, string],
    },
    {
      icon: "calendar-outline" as const,
      label: "Calendar\nView",
      route: "/calendar" as const,
      color: "#1976D2",
      gradient: ["#2196F3", "#1976D2"] as [string, string],
    },
    {
      icon: "time-outline" as const,
      label: "History\nLog",
      route: "/history" as const,
      color: "#C2185B",
      gradient: ["#F06292", "#C2185B"] as [string, string],
    },
    {
      icon: "medical-outline" as const,
      label: "Refill\nTracker",
      route: "/refills" as const,
      color: "#E64A19",
      gradient: ["#FF5722", "#E64A19"] as [string, string],
    },
];

interface CircularProgressProps {
    progress: number;
    totalDoses: number;
    completedDoses: number; 
}

function CircularProgress({ 
    progress, 
    totalDoses, 
    completedDoses, 
}: CircularProgressProps) {
    const animationValue = useRef(new Animated.Value(0)).current;
    const size = width * 0.55
    const strokeWidth = 15
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    useEffect(() => {
        Animated.timing(animationValue, {
            toValue: progress,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const strokeDashoffset = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0], 
    });

    return (
        <View style={styles.progressContainer}>
            <View style={styles.progreesTextContainer}>
                <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                <Text style={styles.progressLabel}>
                    {" "}
                    {completedDoses} of {totalDoses} doses
                </Text>
            </View>
            
                <Svg height={size} width={size} style={styles.progressRing}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="white"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </Svg>     
        </View>
    )    
}
export default function HomeScreen() {
    const router = useRouter();
    
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >
            <LinearGradient colors={["#1a8e2d", "#146922"]} style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerTop}>
                        <View style={{flex: 1}}>
                            <Text style={styles.greeting}>Progress Harian</Text>
                        </View>
                        <TouchableOpacity style={styles.notificationBotton}>
                            <Ionicons name="notifications-outline" size={24} color="white"/>
                            {<View style={styles.notificationBadge}>
                                <Text style={styles.notificationCount}></Text>
                            </View>}
                        </TouchableOpacity>
                    </View>
                    {/* circular progress bar */}
                    <CircularProgress progress={50} totalDoses={10} completedDoses={5} />
                </View>
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.quickActionContainer}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActionGrid}>
                        {QUICK_ACTIONS.map((action) => (
                            <Link href={action.route} key={action.label} asChild>
                                <TouchableOpacity style={styles.actionButton}>
                                    <LinearGradient 
                                        colors={action.gradient} 
                                        style={styles.actionGradient}
                                    >
                                        <View style={styles.actionContent}>
                                            <View style={styles.actionIcon}>
                                                <Ionicons name={action.icon} size={24} color="white" />
                                            </View>
                                            <Text style={styles.actionLabel}>{action.label}</Text>
                                        </View>
                                    </LinearGradient> 
                                </TouchableOpacity>
                            </Link>
                        ))}
                    </View>
                </View>
            </View>

            <View style={{paddingHorizontal: 20}}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Jadwal Harian</Text>
                    <Link href="/calender" asChild>
                    <TouchableOpacity>
                        <Text style={styles.seeAllButton}>Selengkapnya</Text>
                    </TouchableOpacity>
                    </Link>
                </View>
                {true ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="medical-outline" size={49} color="#ccc" />
                        <Text style={styles.emptyStateText}>Belum ada jadwal hari ini</Text>
                        <Link href="/medications/add">
                        <TouchableOpacity style={styles.addMedicationButton}>
                            <Text style={styles.addMedicationButtonText}>Tambah Jadwal</Text>
                        </TouchableOpacity>
                        </Link>
                    </View>
                ) : (
                    [].map((medications) => {
                        return (
                            <View style={styles.doseCard}>
                                <View 
                                style={[
                                    styles.doseBadge,
                                // {
                                //     backgroundColor:medications.color
                                // }
                                ]}
                            >
                                    <Ionicons name="medical" size={24}/>
                                </View>
                                <View style={styles.doseInfo}>
                                    <View>
                                        <Text style={styles.medicineName}>name</Text>
                                        <Text style={styles.dosageInfo}>dosage</Text>
                                    </View>
                                    <View style={styles.doseTime}>
                                        <Ionicons name="time-outline" size={16} color="#ccc"/>
                                        <Text style={styles.timeText}>time</Text>
                                    </View>
                                </View>
                                {true ? (
                                    <View style={styles.takenDoseButton}>
                                        <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50"/>
                                        <Text style={styles.takenDoseText}>Taken</Text>
                                    </View>
                                ): (
                                    <TouchableOpacity style={styles.takenDoseButton}>
                                        <Ionicons name="close-circle-outline" size={24} color="#f44336"/>
                                        <Text style={styles.takenDoseText}>Take</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                )}
            </View>
            <Modal visible={true} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Notifikasi</Text>
                        <TouchableOpacity style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    {[].map((medication)=>(
                        <View style={styles.notificationItem}>
                            <View style={styles.notificationIcon}>
                                <Ionicons name="medical" size={24}/>
                            </View>
                            <View style={styles.notificationContent}>
                                <Text style={styles.notificationTitle}>nama obat</Text>
                                <Text style={styles.notificationMassage}>dosage obat</Text>
                                <Text style={styles.notificationTime}>waktu</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a8e2d',
    },
    header: {
        paddingTop: 50, 
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        opacity: 0.9,
    },
    content: {
        flex: 1,
        paddingTop: 20,
    },
    notificationBotton: {
        position: 'relative',   
        bottom: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        marginLeft: 8,
    },
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ff5252',
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        minWidth: 20,
        borderColor: '#146922',
    },
    notificationCount: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'white',
    },
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    progreesTextContainer: {
        position: 'absolute',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: 36,
        color: 'white',
        fontWeight: 'bold',
    },
    progressLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 'bold',
    },    
    progressDetails: {
        fontSize: 11,
        color: 'white',
        fontWeight: 'bold',
    },
    progressRing: {
        transform: [{ rotate: '-90deg' }],
    },
    quickActionContainer: {
        paddingHorizontal: 20,
        marginBottom: 25
    }, 
    quickActionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 15,
    },
    actionButton: {
        width: (width - 52) / 2,
        height: 110,
        borderRadius: 16,
        overflow: 'hidden',
    },
    actionGradient: {
        flex: 1,
        padding: 15,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        marginTop: 8,
        fontSize: 14,
        color: 'white',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 5,
    },
    actionContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    seeAllButton: {
        fontWeight: '600',
        color: '#2E7D32',
    },
    emptyState: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 16,
        marginTop: 10,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        marginBottom: 20,
    },
    addMedicationButton: {
        backgroundColor: '#1a8e2d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    addMedicationButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    doseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    doseBadge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    doseInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    medicineName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    dosageInfo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    doseTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    takenDoseButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginLeft: 10,
    },
    takenDoseText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    modalOverlay:{
        flex: 1,
        backgroundColor:"rgba(0,0,0,0.5)",
        justifyContent:"flex-end",
    },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    notificationItem: {
        padding: 15,
        borderRadius: 12,
        borderBottomColor: "#f5f5f5",
        marginBottom: 10,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    notificationMassage: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    notificationTime: {
        fontSize: 12,
        color: "#999",
    },
});   