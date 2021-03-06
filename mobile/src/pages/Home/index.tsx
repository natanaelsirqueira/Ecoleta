import React, { useState, useEffect } from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, View, Image, Text, TextInput } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import SelectInput, { Item } from 'react-native-picker-select'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation()

  const [ufs, setUfs] = useState<Item[]>([])
  const [cities, setCities] = useState<Item[]>([])

  const [selectedUf, setSelectedUf] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)

  const IBGE_API_URL = 'https://servicodados.ibge.gov.br/api/v1'

  useEffect(() => {
    axios.get(`${IBGE_API_URL}/localidades/estados`).then(resp => {
      setUfs(resp.data.map((uf: IBGEUFResponse) => ({ label: uf.sigla, value: uf.sigla })))
    })
  }, [])

  useEffect(() => {
    if (!selectedUf) {
      return
    }

    axios.get(`${IBGE_API_URL}/localidades/estados/${selectedUf}/municipios`).then(resp => {
      setCities(resp.data.map((city: IBGECityResponse) => ({ label: city.nome, value: city.nome })))
    })
  }, [selectedUf])

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}>

        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />

          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <SelectInput
            placeholder={{ label: "Selecione a UF", value: null }}
            onValueChange={value => setSelectedUf(value)}
            items={ufs}
          />

          <SelectInput
            placeholder={{ label: "Selecione a cidade", value: null }}
            disabled={!selectedUf}
            onValueChange={value => setSelectedCity(value)}
            items={cities}
          />

          <RectButton
            style={styles.button}
            onPress={() => navigation.navigate('Points', { uf: selectedUf, city: selectedCity })}
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Feather name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>

            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home
