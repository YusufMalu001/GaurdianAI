import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors, Theme } from '../../constants/theme';
import GlassCard from '../../components/ui/GlassCard';
import GlowText from '../../components/ui/GlowText';
import { Activity, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react-native';
import { useUserStore } from '../../store/userStore';
import { useSafetyScore } from '../../hooks/useSafetyScore';

const getChartHtml = (data: number[]) => `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>body{margin:0;background:transparent}canvas{display:block}</style>
</head><body>
<canvas id="c" width="360" height="200"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
var ctx=document.getElementById('c').getContext('2d');
new Chart(ctx,{type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Safety Score',data:[${data.join(',')}],borderColor:'#7B2FF7',backgroundColor:'rgba(123,47,247,0.15)',borderWidth:3,pointBackgroundColor:'#00E5C3',tension:0.4,fill:true}]},options:{plugins:{legend:{labels:{color:'#fff'}}},scales:{x:{ticks:{color:'rgba(255,255,255,0.6)'},grid:{color:'rgba(255,255,255,0.05)'}},y:{min:60,max:100,ticks:{color:'rgba(255,255,255,0.6)'},grid:{color:'rgba(255,255,255,0.05)'}}}}});
</script></body></html>`;

export default function InsightsScreen() {
  const { profile } = useUserStore();
  const { score } = useSafetyScore();
  const chartData = [85, 90, 78, 88, 96, 92, score || 94];
  const chartHtml = getChartHtml(chartData);

  const CARDS = [
    { icon: TrendingUp, label: 'Safe Trips', value: String(profile?.totalTrips ?? 0), sub: 'Total trips taken', color: Colors.success },
    { icon: TrendingDown, label: 'Safe Miles', value: String(profile?.safeMiles ?? 0), sub: 'Total distance', color: '#FFB800' },
    { icon: AlertTriangle, label: 'High Risk Hours', value: '10pm–2am', sub: 'Based on your routes', color: Colors.danger },
    { icon: Activity, label: 'Safety Score', value: `${score}%`, sub: 'Current area', color: Colors.purple },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Activity color={Colors.cyan} size={22} />
          <GlowText style={styles.title} color={Colors.white} glowColor={Colors.cyan}> AI SAFETY INSIGHTS</GlowText>
        </View>

        {/* Chart */}
        <GlassCard style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Safety Score</Text>
          {Platform.OS === 'web'
            ? <iframe srcDoc={chartHtml} style={{ width:'100%', height:220, border:'none' } as any} title="Chart" />
            : <WebView source={{ html: chartHtml }} style={{ width: '100%', height: 220, backgroundColor: 'transparent' }} scrollEnabled={false} />}
        </GlassCard>

        {/* Stat Cards */}
        <View style={styles.grid}>
          {CARDS.map(({ icon: Icon, label, value, sub, color }) => (
            <GlassCard key={label} style={styles.statCard}>
              <Icon color={color} size={22} />
              <Text style={[styles.statValue, { color }]}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statSub}>{sub}</Text>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { padding: Theme.spacing.lg, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.xl },
  title: { fontSize: 18, letterSpacing: 2 },
  chartCard: { padding: Theme.spacing.md, marginBottom: Theme.spacing.xl },
  chartTitle: { color: Colors.white60, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: Theme.spacing.sm },
  chartPlaceholder: { color: Colors.white60, textAlign: 'center', padding: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '47%', marginBottom: Theme.spacing.md, padding: Theme.spacing.md },
  statValue: { fontSize: 26, fontWeight: '800', marginTop: Theme.spacing.sm },
  statLabel: { color: Colors.white, fontSize: 13, fontWeight: '600', marginTop: 2 },
  statSub: { color: Colors.white60, fontSize: 11, marginTop: 2 },
});
