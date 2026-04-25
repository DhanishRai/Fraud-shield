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

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
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
          // Actual API call
          const result = await analyzeQR(parsedData);
          setAnalysis(result);
        } else {
          // Fallback to mock data if no parsed data (for direct navigation testing)
          setTimeout(() => {
            setAnalysis({
              risk_score: 12,
              status: 'Safe',
              reasons: ["Verified merchant profile", "Safe transaction history", "SSL Encryption active"]
            });
          }, 1000);
        }
      } catch (error) {
        Alert.alert('Analysis Error', error.message);
        navigation.goBack();
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
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Running AI Threat Analysis...</Text>
      </ScreenContainer>
    );
  }

  const { risk_score, status, reasons } = analysis;
  const isSuspicious = status !== 'Safe';
  
  const getStatusColor = () => {
    if (status === 'Safe') return '#00C853';
    return '#FF1744';
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
                {isSuspicious ? (
                  <AlertTriangle color="#FF1744" size={40} />
                ) : (
                  <ShieldCheck color="#00C853" size={40} />
                )}
                <Text style={[styles.scoreText, { color: getStatusColor() }]}>{risk_score}%</Text>
                <Text style={styles.scoreLabel}>Risk Level</Text>
             </LinearGradient>
          </View>
        </View>

        <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <View style={styles.statusBadgeContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15', borderColor: getStatusColor() }]}>
               <Text style={[styles.statusText, { color: getStatusColor() }]}>{status.toUpperCase()}</Text>
            </View>
          </View>

          <RiskCard 
            score={risk_score} 
            status={status} 
            reasons={reasons}
          />

          <View style={styles.actionContainer}>
            {isSuspicious ? (
              <>
                <PrimaryButton 
                  title="Report this Scam" 
                  onPress={() => navigation.navigate('ReportScam')} 
                  style={{ backgroundColor: '#FF1744' }}
                />
                <SecondaryButton 
                  title="Cancel Payment" 
                  onPress={() => navigation.navigate('Home')} 
                />
              </>
            ) : (
              <PrimaryButton 
                title="Proceed to Pay" 
                onPress={() => navigation.navigate('PaymentOptions', { paymentData: parsedData })} 
              />
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
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#0066FF',
    fontWeight: '600',
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
    marginBottom: 20,
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
  actionContainer: {
    width: width - 48,
    marginTop: 20,
  }
});

export default ResultScreen;
