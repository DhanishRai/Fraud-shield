import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, ActivityIndicator, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import RiskCard from '../components/RiskCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { analyzeQR } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
  const { simpleMode } = useSettings();
  const { scanData, parsedData } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  
  // Animation values
  const ringAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        if (parsedData) {
          // Actual API call to Node.js backend → Flask AI
          const result = await analyzeQR(parsedData);
          setAnalysis(result);
        } else {
          // Fallback mock for direct navigation / history viewing
          setTimeout(() => {
            setAnalysis({
              risk_score: 12,
              status: 'SAFE',
              confidence: 0.85,
              reasons: ["Verified merchant profile", "Safe transaction history"]
            });
          }, 1000);
        }
      } catch (error) {
        Alert.alert('Analysis Error', error.message, [
          { text: 'Go Back', onPress: () => navigation.goBack() }
        ]);
        return;
      } finally {
        setLoading(false);
        startAnimations();
      }
    };

    performAnalysis();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (loading) {
    return (
      <ScreenContainer style={styles.loadingContainer}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingTitle}>Analyzing AI Risk...</Text>
          <Text style={styles.loadingSubtitle}>Scanning merchant database</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!analysis) return null;

  const { risk_score, status, reasons, confidence } = analysis;
  const isSafe = status === 'SAFE';
  const isHighRisk = status === 'HIGH_RISK';
  
  const getStatusColor = () => {
    if (isSafe) return '#00C853';
    if (isHighRisk) return '#FF1744';
    return '#FF9100'; // SUSPICIOUS = orange
  };

  const getStatusLabel = () => {
    if (isSafe) return simpleMode ? 'SAFE' : 'SAFE';
    if (isHighRisk) return simpleMode ? 'DANGER!' : 'HIGH RISK';
    return simpleMode ? 'WARNING!' : 'SUSPICIOUS';
  };

  const getStatusIcon = () => {
    if (isSafe) return <ShieldCheck color="#00C853" size={40} />;
    if (isHighRisk) return <ShieldAlert color="#FF1744" size={40} />;
    return <AlertTriangle color="#FF9100" size={40} />;
  };

  return (
    <ScreenContainer>
      <Header title="Analysis Result" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.meterContainer}>
          <Animated.View style={[styles.glowRing, { 
            borderColor: getStatusColor(),
            opacity: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }),
            transform: [{ scale: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }]
          }]} />
          
          <View style={[styles.mainCircle, { borderColor: getStatusColor() }]}>
             <LinearGradient
               colors={['#FFFFFF', '#F8FAFF']}
               style={styles.circleInner}
             >
                {getStatusIcon()}
                <Text style={[styles.scoreText, { color: getStatusColor() }]}>{risk_score}%</Text>
                <Text style={styles.scoreLabel}>Risk Level</Text>
             </LinearGradient>
          </View>
        </View>

        <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <View style={styles.statusBadgeContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15', borderColor: getStatusColor() }]}>
               <Text style={[styles.statusText, { color: getStatusColor() }, simpleMode && { fontSize: 24, fontWeight: '900' }]}>{getStatusLabel()}</Text>
            </View>
          </View>

          {confidence > 0 && !simpleMode && (
            <Text style={styles.confidenceText}>AI Confidence: {Math.round(confidence * 100)}%</Text>
          )}

          <RiskCard 
            score={risk_score} 
            status={getStatusLabel()} 
            reasons={reasons || []}
          />

          <View style={styles.actionContainer}>
            {isSafe ? (
              <PrimaryButton 
                title={simpleMode ? "Pay Now" : "Proceed to Pay"}
                onPress={() => navigation.navigate('PaymentOptions', { paymentData: parsedData })} 
              />
            ) : (
              <>
                <PrimaryButton 
                  title={simpleMode ? "STOP & REPORT SCAM" : "Report this Scam"}
                  onPress={() => navigation.navigate('ReportScam', { 
                    upiId: parsedData?.upiId 
                  })} 
                  style={{ backgroundColor: '#FF1744' }}
                />
                <SecondaryButton 
                  title={simpleMode ? "GO BACK" : "Cancel Payment"}
                  onPress={() => navigation.navigate('Home')} 
                />
              </>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    alignItems: 'center',
  },
  loadingTitle: {
    marginTop: 20,
    fontSize: 18,
    color: '#0066FF',
    fontWeight: '700',
  },
  loadingSubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  meterContainer: {
    height: 240,
    width: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  glowRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 20,
  },
  mainCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  circleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 42,
    fontWeight: '900',
    marginTop: 5,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '700',
  },
  statusBadgeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  confidenceText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 15,
  },
  actionContainer: {
    width: width - 48,
    marginTop: 20,
  }
});

export default ResultScreen;
