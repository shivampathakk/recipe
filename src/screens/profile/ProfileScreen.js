import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import client from '../../api/client';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [showLogout, setShowLogout] = useState(false);

  const loadLikedRecipes = async () => {
    const res = await client.get('/recipes');
    const list = res.data.filter((r) => (r.likes || []).includes(user.id));
    setLikedRecipes(list);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadLikedRecipes);
    return unsub;
  }, [navigation]);

  const confirmLogout = async () => {
    await logout();
    setShowLogout(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Liked Recipes</Text>
      <FlatList
        data={likedRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.likedItem}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
          >
            <Text style={styles.likedTitle} numberOfLines={1}>{item.title}</Text>
            <Icon name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No liked recipes yet.</Text>}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogout(true)}>
        <Icon name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        visible={showLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogout(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#eee' }]}
                onPress={() => setShowLogout(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#e57373' }]}
                onPress={confirmLogout}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffccbc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#ff7043' },
  name: { fontSize: 18, fontWeight: '700', color: '#333' },
  email: { fontSize: 14, color: '#777' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  likedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  likedTitle: { flex: 1, fontSize: 14 },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#ff7043',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  logoutText: { color: '#fff', marginLeft: 8, fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalText: { fontSize: 14, color: '#555', marginBottom: 16 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 8,
  },
});
