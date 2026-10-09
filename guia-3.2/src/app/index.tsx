import { useEffect, useState } from "react";
import { styles } from '../styles';
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export type RAMCharacters = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: Date;
}

export type Location = {
  name: string;
  url: string;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Alive':
      return styles.statusAlive;
    case 'Dead':
      return styles.statusDead;
    default:
      return styles.statusUnknown;
  }
}

function ListItem(props: { item: RAMCharacters }) {
  const { item } = props;
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.detailText}>{item.species}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, getStatusStyle(item.status)]} />
          <Text style={styles.statusText}>
            {item.status} - {item.gender}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default function HomeScreen() {
  const [characters, setCharacters] = useState<RAMCharacters[]>([]);
  const [isLoading, setIsloading] = useState(true)

  const fetchCharacters = async () => {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character')
      const data = await response.json();
      setCharacters(data.results);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setIsloading(false);
    }
  }

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rick & Morty API por JGER </Text>
        <Text style={styles.subtitle}>Personaje obtenidos con fetch()</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'large'} color={'#97ce4c'} />
          <Text style={styles.loadingText}>Cargando del Multiverso...</Text>
        </View>
      ) : (
        <FlatList data={characters} keyExtractor={(item => item.id.toString())} contentContainerStyle={styles.listContent} renderItem={({ item }) => <ListItem item={item} />} />
      )}
    </View>
  );
}

