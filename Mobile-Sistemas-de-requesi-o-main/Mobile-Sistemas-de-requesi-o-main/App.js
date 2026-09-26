import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

function AppIcon() {
  return (
    <View style={styles.appIcon}>
      <Ionicons name="person-outline" size={26} color="#FFFFFF" />
    </View>
  );
}

function Campo({ label, value, onChangeText, placeholder, secureTextEntry = false, icon }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && <Ionicons name={icon} size={17} color="#9AA0A6" style={styles.inputIcon} />}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B7BCC5"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

function LoginScreen({ onNavigate }) {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const fazerLogin = async () => {
    if (!matricula || !senha) {
  window.alert("Atenção\n\nPreencha a matrícula e a senha!");
  return;
}

    setCarregando(true);
    try {
      const resposta = await fetch('http://10.31.37.12:8080/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula: matricula,
          senha: senha
        })
      });

      if (resposta.ok) {
        onNavigate("home");
      } else {
        window.alert("Matrícula ou senha incorretos!");
      }
    } catch (erro) {
      console.error(erro);
      window.alert("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <AppIcon />
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Acesse sua conta do sistema</Text>

          <Campo 
            label="Matrícula" 
            value={matricula} 
            onChangeText={setMatricula} 
            placeholder="Digite sua matrícula" 
            icon="person-outline" 
          />
          <Campo 
            label="Senha" 
            value={senha} 
            onChangeText={setSenha} 
            placeholder="Digite sua senha" 
            secureTextEntry={true} 
            icon="lock-closed-outline" 
          />

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={fazerLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Não tem uma conta?{" "}
            <Text style={styles.link} onPress={() => onNavigate("cadastro")}>Criar conta</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function CadastroScreen({ onNavigate }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <AppIcon />
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Crie sua conta para começar</Text>

          <Campo label="Nome" value={nome} onChangeText={setNome} placeholder="Digite seu nome completo" icon="person-outline" />
          <Campo label="E-mail" value={email} onChangeText={setEmail} placeholder="Digite seu e-mail" icon="mail-outline" />
          <Campo label="Senha" value={senha} onChangeText={setSenha} placeholder="Crie uma senha" secureTextEntry={true} icon="lock-closed-outline" />

          <TouchableOpacity style={styles.primaryButton} onPress={() => onNavigate("login")}>
            <Text style={styles.primaryButtonText}>Cadastrar</Text>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Já tem conta?{" "}
            <Text style={styles.link} onPress={() => onNavigate("login")}>Entrar</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function HomeScreen({ onNavigate }) {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true); 

  const buscarRequisicoes = async () => {
    try {
      const resposta = await fetch('http://10.31.37.12:8080/api/requisicoes');
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setChamados(dados); 
      } else {
        console.error("A API retornou um erro:", resposta.status);
      }
    } catch (erro) {
      console.error("Erro ao conectar com o back-end:", erro);
    } finally {
      setCarregando(false); 
    }
  };

  useEffect(() => {
    buscarRequisicoes();
  }, []);

  return (
    <View style={styles.homeContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>SISOL</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => onNavigate("login")}>
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.homeScroll}>
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>Pedidos de Solicitação</Text>
          <TouchableOpacity style={styles.newButton}>
            <Text style={styles.newButtonText}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#3F6FE5" style={{ marginTop: 50 }} />
        ) : (
          chamados.map((item) => (
            <View key={item.id} style={styles.chamadoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.chamadoCategory}>
                  {item.tipo ? item.tipo.replace(/_/g, ' ') : "GERAL"}
                </Text>
                
                <View
                  style={[
                    styles.badge,
                    item.status === "AGUARDO" && styles.badgePendente,
                    item.status === "CONCLUIDO" && styles.badgeResolvido,
                    item.status === "NEGADA" && { backgroundColor: '#FEE2E2' }, 
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      item.status === "AGUARDO" && styles.badgeTextPendente,
                      item.status === "CONCLUIDO" && styles.badgeTextResolvido,
                      item.status === "NEGADA" && { color: '#991B1B' },
                    ]}
                  >
                    {item.status || "NOVO"}
                  </Text>
                </View>
              </View>

              <Text style={styles.chamadoTitle} numberOfLines={2}>
                {item.descricao}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={styles.chamadoDate}>Data: {item.data || "Sem data"}</Text>
                <Ionicons name="chevron-forward" size={16} color="#9AA0A6" />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {currentScreen === "login" && <LoginScreen onNavigate={setCurrentScreen} />}
      {currentScreen === "cadastro" && <CadastroScreen onNavigate={setCurrentScreen} />}
      {currentScreen === "home" && <HomeScreen onNavigate={setCurrentScreen} />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FC" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: {
    width: "100%", maxWidth: 400, alignSelf: "center", backgroundColor: "#FFFFFF",
    borderRadius: 20, padding: 24, shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08,
    shadowRadius: 15, elevation: 5,
  },
  appIcon: {
    width: 50, height: 50, borderRadius: 12, backgroundColor: "#3F6FE5",
    alignItems: "center", justifyContent: "center", alignSelf: "center",
    marginBottom: 16, shadowColor: "#3F6FE5", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  title: { textAlign: "center", color: "#202124", fontSize: 24, fontWeight: "700" },
  subtitle: { textAlign: "center", color: "#777E87", fontSize: 12, marginTop: 4, marginBottom: 24 },
  fieldContainer: { marginBottom: 14 },
  label: { color: "#40454D", fontSize: 12, fontWeight: "600", marginBottom: 6 },
  inputContainer: {
    height: 46, borderWidth: 1, borderColor: "#E0E3E8", borderRadius: 8,
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF",
  },
  inputIcon: { marginLeft: 12, marginRight: 8 },
  input: { flex: 1, height: "100%", color: "#292D32", fontSize: 13, paddingRight: 12 },
  forgotButton: { alignSelf: "flex-end", marginTop: 4, marginBottom: 16 },
  forgotText: { color: "#3769D4", fontSize: 11, fontWeight: "500" },
  primaryButton: {
    height: 46, backgroundColor: "#3F6FE5", borderRadius: 8, alignItems: "center",
    justifyContent: "center", marginTop: 4, shadowColor: "#3F6FE5",
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  bottomText: { textAlign: "center", color: "#7B8189", fontSize: 12, marginTop: 20 },
  link: { color: "#3266D5", fontWeight: "600" },
  homeContainer: { flex: 1, backgroundColor: "#F7F9FC" },
  headerBar: {
    height: 64, backgroundColor: "#3F6FE5", flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 10, elevation: 4,
  },
  headerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold", letterSpacing: 1.2 },
  logoutButton: { padding: 6 },
  homeScroll: { padding: 20, maxWidth: 600, width: "100%", alignSelf: "center" },
  welcomeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  welcomeText: { fontSize: 16, fontWeight: "700", color: "#202124" },
  newButton: { backgroundColor: "#3F6FE5", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  newButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  chamadoCard: {
    backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: "#E0E3E8", shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  chamadoCategory: { fontSize: 11, fontWeight: "600", color: "#777E87", textTransform: "uppercase" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgePendente: { backgroundColor: "#FEF3C7" },
  badgeAndamento: { backgroundColor: "#DBEAFE" },
  badgeResolvido: { backgroundColor: "#D1FAE5" },
  badgeText: { fontSize: 10, fontWeight: "600" },
  badgeTextPendente: { color: "#92400E" },
  badgeTextAndamento: { color: "#1E40AF" },
  badgeTextResolvido: { color: "#065F46" },
  chamadoTitle: { fontSize: 14, fontWeight: "600", color: "#202124", marginBottom: 12 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#F0F2F5", paddingTop: 10 },
  chamadoDate: { fontSize: 11, color: "#9AA0A6" },
});
