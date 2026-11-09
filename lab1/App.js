import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
  TextInput,
  Switch,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

const BRAND = '#5bf0f0';
const DARK = '#25343F';
const LIGHT_GREY = '#eeeeee';

const ARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  heading: `Новина №${i + 1}`,
  published: '11.11.2026',
  summary:
    'Короткий опис новини. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
}));

const PHOTO_IDS = Array.from({ length: 12 }, (_, i) => ({ id: String(i) }));

const TabNav = createMaterialTopTabNavigator();

const TopBar = () => (
  <View style={styles.topBar}>
    <Image source={require('./src/assets/logo.png')} style={styles.topBarLogo} />
    <Text style={styles.topBarTitle}>CATS😸😸😸</Text>
  </View>
);

const BottomInfo = () => (
  <View style={styles.bottomInfo}>
    <Text style={styles.bottomInfoText}>Бондар Іван Миколайович, ВТ-24-1</Text>
  </View>
);

const SectionBanner = ({ label, children }) => (
  <View style={styles.sectionBanner}>
    <Text style={styles.sectionBannerText}>{label}</Text>
    {children}
  </View>
);

// ---------- registration / profile ----------
const LabeledField = ({ label, ...inputProps }) => (
  <View>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput style={styles.fieldInput} {...inputProps} />
  </View>
);

const RegistrationScreen = () => {
  const [notify, setNotify] = useState(true);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 120}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.formWrapper}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <SectionBanner label="Профіль" />

          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={56} color="#555" />
          </View>

          <LabeledField label="ПІБ" placeholder="Прізвище Ім'я По батькові" />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>КОНТАКТИ</Text>
            <LabeledField label="Email" keyboardType="email-address" autoCapitalize="none" />
            <LabeledField label="Група" />
            <LabeledField label="Пароль" secureTextEntry />
            <LabeledField label="Пароль (ще раз)" secureTextEntry />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>НАЛАШТУВАННЯ</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchLabelBox}>
                <Ionicons name="notifications-outline" size={20} color={DARK} />
                <Text style={styles.switchLabel}>Сповіщення</Text>
              </View>
              <Switch
                value={notify}
                onValueChange={setNotify}
                trackColor={{ true: BRAND, false: '#ccc' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.centered}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
              <Text style={styles.primaryButtonText}>Зареєструватися</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// ---------- gallery ----------
const ZoomTile = ({ wide }) => {
  const zoom = useRef(new Animated.Value(1)).current;
  const [lifted, setLifted] = useState(false);

  const animateTo = (value, done) =>
    Animated.spring(zoom, { toValue: value, useNativeDriver: true }).start(done);

  const handlePressIn = () => {
    setLifted(true);
    animateTo(1.5);
  };

  const handlePressOut = () => animateTo(1, () => setLifted(false));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1, zIndex: lifted ? 10 : 1 }}
    >
      <Animated.View
        style={[
          styles.tile,
          wide && styles.tileWide,
          { transform: [{ scale: zoom }] },
        ]}
      >
        <View style={styles.tileInner} />
      </Animated.View>
    </Pressable>
  );
};

const PhotoGalleryScreen = () => {
  const [gridMode, setGridMode] = useState(true);
  const columns = gridMode ? 3 : 1;

  const toggle = (
    <View style={styles.toggleRow}>
      <Ionicons
        name="grid"
        size={22}
        color={gridMode ? '#000' : '#888'}
        onPress={() => setGridMode(true)}
      />
      <Ionicons
        name="list"
        size={24}
        color={!gridMode ? '#000' : '#888'}
        onPress={() => setGridMode(false)}
      />
    </View>
  );

  return (
    <FlatList
      key={columns}
      data={PHOTO_IDS}
      numColumns={columns}
      keyExtractor={(photo) => photo.id}
      renderItem={() => <ZoomTile wide={!gridMode} />}
      contentContainerStyle={styles.galleryContent}
      ListHeaderComponent={<SectionBanner label="Фотогалерея">{toggle}</SectionBanner>}
    />
  );
};

// ---------- home / news ----------
const HomeScreen = () => {
  const [query, setQuery] = useState('');

  const visibleArticles = useMemo(
    () =>
      ARTICLES.filter((a) =>
        a.heading.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query]
  );

  const header = (
    <View>
      <SectionBanner label="Новини" />
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#667" />
        <TextInput
          style={styles.searchInput}
          placeholder="Пошук..."
          value={query}
          onChangeText={setQuery}
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={visibleArticles}
      keyExtractor={(article) => article.id}
      ListHeaderComponent={header}
      renderItem={({ item }) => (
        <View style={styles.articleRow}>
          <View style={styles.articleThumb}>
            <Ionicons name="image-outline" size={60} color="#ccc" />
          </View>
          <View style={styles.articleBody}>
            <Text style={styles.articleHeading}>{item.heading}</Text>
            <Text style={styles.articleDate}>{item.published}</Text>
            <Text style={styles.articleSummary}>{item.summary}</Text>
          </View>
        </View>
      )}
    />
  );
};

// ---------- root ----------
const iconForRoute = (routeName) => {
  switch (routeName) {
    case 'Головна':
      return 'home';
    case 'Галерея':
      return 'images';
    default:
      return 'person';
  }
};

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <NavigationContainer>
        <TopBar />

        <TabNav.Navigator
          tabBarPosition="bottom"
          screenOptions={({ route }) => ({
            tabBarShowIcon: true,
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: { fontSize: 10, textTransform: 'none' },
            tabBarIndicatorStyle: {
              backgroundColor: '#000',
              height: 5,
              borderRadius: 15,
            },
            tabBarIcon: ({ color }) => (
              <Ionicons name={iconForRoute(route.name)} size={24} color={color} />
            ),
          })}
        >
          <TabNav.Screen name="Головна" component={HomeScreen} />
          <TabNav.Screen name="Галерея" component={PhotoGalleryScreen} />
          <TabNav.Screen name="Профіль" component={RegistrationScreen} />
        </TabNav.Navigator>

        <BottomInfo />
      </NavigationContainer>
    </SafeAreaView>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },

  // top bar / footer
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: LIGHT_GREY,
  },
  topBarLogo: { width: 150, height: 40, resizeMode: 'contain' },
  topBarTitle: { fontSize: 18, fontWeight: 'bold' },
  bottomInfo: { padding: 5, alignItems: 'center', backgroundColor: LIGHT_GREY },
  bottomInfoText: { fontSize: 12, fontStyle: 'italic', color: '#555' },


  sectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: BRAND,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  sectionBannerText: { fontSize: 24 },

  // home
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccd',
    borderRadius: 12,
  },
  searchInput: { flex: 1, padding: 8, marginLeft: 6 },
  articleRow: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: LIGHT_GREY,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  articleThumb: {
    width: 125,
    height: 125,
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleBody: { flex: 1, marginLeft: 15 },
  articleHeading: { fontSize: 16, fontWeight: 'bold', color: DARK },
  articleDate: { fontSize: 12, color: 'gray' },
  articleSummary: { fontSize: 14 },

  // gallery
  toggleRow: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    gap: 14,
  },
  galleryContent: { padding: 10 },
  tile: {
    flex: 1,
    height: 100,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: BRAND,
    elevation: 2,
  },
  tileWide: { height: 160 },
  tileInner: { flex: 1, borderRadius: 8, backgroundColor: BRAND },

  // profile
  formWrapper: { padding: 20, paddingTop: 0 },
  formContent: { paddingBottom: 100 },
  avatarCircle: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    marginVertical: 15,
    borderRadius: 55,
    backgroundColor: LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldLabel: { marginTop: 4 },
  fieldInput: {
    marginTop: 5,
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
  },
  card: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { marginBottom: 10, fontWeight: 'bold', color: '#667' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabelBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  switchLabel: { fontWeight: 'bold' },
  primaryButton: {
    width: '50%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: BRAND,
  },
  primaryButtonText: { color: '#fff', fontWeight: 'bold' },
});