
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// =====================================================
// CONFIGURAÇÃO DA API
// =====================================================

const API_URL = "http://10.31.37.11:8080/api";

// =====================================================
// ÍCONE DO APLICATIVO
// =====================================================

function AppIcon() {
  return (
    <View style={styles.appIcon}>
      <Ionicons name="person-outline" size={26} color="#FFFFFF" />
    </View>
  );
}

// =====================================================
// CAMPO REUTILIZÁVEL
// =====================================================

function Campo({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  icon,
  multiline = false,
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          multiline && styles.inputContainerMultiline,
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color="#9AA0A6"
          style={
            multiline ? styles.inputIconTop : styles.inputIcon
          }
        />

        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B7BCC5"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
    </View>
  );
}

// =====================================================
// TELA DE LOGIN
// =====================================================

function LoginScreen({ onNavigate }) {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const fazerLogin = async () => {
    if (!matricula.trim() || !senha.trim()) {
      Alert.alert(
        "Atenção",
        "Preencha a matrícula e a senha!"
      );
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(
        `${API_URL}/usuarios/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            matricula: matricula.trim(),
            senha: senha,
          }),
        }
      );

      const resultado = await resposta.text();

      console.log("Resposta do login:", resultado);

      if (resposta.ok) {
        // Login realizado com sucesso
        onNavigate("home");
      } else {
        Alert.alert(
          "Login inválido",
          "Matrícula ou senha incorretos!"
        );
      }
    } catch (erro) {
      console.error(
        "Erro ao conectar com o backend:",
        erro
      );

      Alert.alert(
        "Erro de conexão",
        "Não foi possível conectar ao servidor.\n\nVerifique se o Spring Boot está rodando e se o IP está correto."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <AppIcon />

          <Text style={styles.title}>Login</Text>

          <Text style={styles.subtitle}>
            Acesse sua conta do sistema
          </Text>

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
            secureTextEntry
            icon="lock-closed-outline"
          />

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() =>
              Alert.alert(
                "Recuperação de senha",
                "A função de recuperação de senha ainda não foi implementada."
              )
            }
          >
            <Text style={styles.forgotText}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={fazerLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Não tem uma conta?{" "}
            <Text
              style={styles.link}
              onPress={() => onNavigate("cadastro")}
            >
              Criar conta
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// =====================================================
// TELA DE CADASTRO
// =====================================================

function CadastroScreen({ onNavigate }) {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [turmaId, setTurmaId] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const turmas = [
    { id: 1, nome: "1º Ano A" },
    { id: 2, nome: "1º Ano B" },
    { id: 3, nome: "2º Ano A" },
    { id: 4, nome: "2º Ano B" },
    { id: 5, nome: "3º Ano B" },
  ];

  const cadastrarUsuario = async () => {
    if (
      !nome.trim() ||
      !matricula.trim() ||
      !senha.trim()
    ) {
      Alert.alert(
        "Atenção",
        "Preencha nome, matrícula e senha!"
      );
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(
  `${API_URL}/usuarios/criar`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nome.trim(),
      matricula: matricula.trim(),
      senha: senha,
      turmaId: turmaId,
    }),
  }
);

      const resultado = await resposta.text();

      console.log(
        "Resposta do cadastro:",
        resultado
      );

      if (resposta.ok) {
  setNome("");
  setMatricula("");
  setSenha("");
  setTurmaId(1);

  Alert.alert(
    "Cadastro realizado",
    "Sua conta foi criada com sucesso!"
  );

  onNavigate("login");
}
    } catch (erro) {
      console.error(
        "Erro ao conectar com o backend:",
        erro
      );

      Alert.alert(
        "Erro de conexão",
        "Não foi possível conectar ao servidor.\n\nVerifique se o Spring Boot está rodando."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <AppIcon />

          <Text style={styles.title}>Cadastro</Text>

          <Text style={styles.subtitle}>
            Crie sua conta para começar
          </Text>

          <Campo
            label="Nome"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome completo"
            icon="person-outline"
          />

          <Campo
            label="Matrícula"
            value={matricula}
            onChangeText={setMatricula}
            placeholder="Digite sua matrícula"
            icon="card-outline"
          />

          <Campo
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Crie uma senha"
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Text style={styles.label}>Turma</Text>

          <View style={styles.turmaContainer}>
            {turmas.map((turma) => (
              <TouchableOpacity
                key={turma.id}
                style={[
                  styles.turmaButton,
                  turmaId === turma.id &&
                    styles.turmaButtonSelected,
                ]}
                onPress={() => setTurmaId(turma.id)}
              >
                <Text
                  style={[
                    styles.turmaButtonText,
                    turmaId === turma.id &&
                      styles.turmaButtonTextSelected,
                  ]}
                >
                  {turma.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={cadastrarUsuario}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Cadastrar
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Já tem uma conta?{" "}
            <Text
              style={styles.link}
              onPress={() => onNavigate("login")}
            >
              Entrar
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// =====================================================
// TELA HOME
// =====================================================

function HomeScreen({ onNavigate }) {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const buscarRequisicoes = async () => {
    try {
      setCarregando(true);

      const resposta = await fetch(
        `${API_URL}/requisicoes`
      );

      if (resposta.ok) {
        const dados = await resposta.json();

        console.log(
          "Requisições recebidas:",
          dados
        );

        setChamados(
          Array.isArray(dados) ? dados : []
        );
      } else {
        console.error(
          "A API retornou um erro:",
          resposta.status
        );

        Alert.alert(
          "Erro",
          "Não foi possível carregar as solicitações."
        );
      }
    } catch (erro) {
      console.error(
        "Erro ao conectar com o back-end:",
        erro
      );

      Alert.alert(
        "Erro de conexão",
        "Não foi possível carregar as solicitações."
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarRequisicoes();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "AGUARDO":
        return {
          container: styles.badgePendente,
          text: styles.badgeTextPendente,
        };

      case "CONCLUIDO":
        return {
          container: styles.badgeResolvido,
          text: styles.badgeTextResolvido,
        };

      case "NEGADA":
        return {
          container: styles.badgeNegada,
          text: styles.badgeTextNegada,
        };

      default:
        return {
          container: styles.badgeNovo,
          text: styles.badgeTextNovo,
        };
    }
  };

  return (
    <View style={styles.homeContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>
          SISOL
        </Text>

        <View style={styles.headerActions}>
          {/* BOTÃO PERFIL */}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => onNavigate("usuario")}
          >
            <Ionicons
              name="person-circle-outline"
              size={26}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* BOTÃO SAIR */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => onNavigate("login")}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.homeScroll}
      >
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>
            Pedidos de Solicitação
          </Text>

          <TouchableOpacity
            style={styles.newButton}
            onPress={() =>
              onNavigate("novaRequisicao")
            }
          >
            <Text style={styles.newButtonText}>
              + Novo
            </Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#3F6FE5"
            style={{ marginTop: 50 }}
          />
        ) : chamados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="document-text-outline"
              size={45}
              color="#B7BCC5"
            />

            <Text style={styles.emptyTitle}>
              Nenhuma solicitação
            </Text>

            <Text style={styles.emptyText}>
              Ainda não existem pedidos cadastrados.
            </Text>
          </View>
        ) : (
          chamados.map((item, index) => {
            const statusStyle =
              getStatusStyle(item.status);

            return (
              <TouchableOpacity
                key={item.id ?? index}
                style={styles.chamadoCard}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    item.tipo
                      ? item.tipo.replace(/_/g, " ")
                      : "GERAL",
                    `Descrição: ${
                      item.descricao ||
                      "Sem descrição"
                    }\n\nStatus: ${
                      item.status || "NOVO"
                    }\n\nData: ${
                      item.data || "Sem data"
                    }`
                  )
                }
              >
                <View style={styles.cardHeader}>
                  <Text
                    style={styles.chamadoCategory}
                  >
                    {item.tipo
                      ? item.tipo.replace(/_/g, " ")
                      : "GERAL"}
                  </Text>

                  <View
                    style={[
                      styles.badge,
                      statusStyle.container,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        statusStyle.text,
                      ]}
                    >
                      {item.status || "NOVO"}
                    </Text>
                  </View>
                </View>

                <Text
                  style={styles.chamadoTitle}
                  numberOfLines={2}
                >
                  {item.descricao ||
                    "Sem descrição"}
                </Text>

                <View style={styles.cardFooter}>
                  <Text
                    style={styles.chamadoDate}
                  >
                    Data:{" "}
                    {item.data || "Sem data"}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#9AA0A6"
                  />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

// =====================================================
// TELA DE USUÁRIO / PERFIL
// =====================================================

function UsuarioScreen({ onNavigate }) {
  return (
    <View style={styles.homeContainer}>
      <View style={styles.innerHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate("home")}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.innerHeaderTitle}>
          Meu Perfil
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.profileScroll}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons
              name="person"
              size={45}
              color="#3F6FE5"
            />
          </View>

          <Text style={styles.profileName}>
            João da Silva
          </Text>

          <Text style={styles.profileSubtitle}>
            Usuário do sistema
          </Text>

          <View style={styles.profileDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#3F6FE5"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Nome
              </Text>

              <Text style={styles.infoValue}>
                João da Silva
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="card-outline"
                size={20}
                color="#3F6FE5"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Matrícula
              </Text>

              <Text style={styles.infoValue}>
                2026123456
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#3F6FE5"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                E-mail
              </Text>

              <Text style={styles.infoValue}>
                joao.silva@email.com
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="school-outline"
                size={20}
                color="#3F6FE5"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Setor
              </Text>

              <Text style={styles.infoValue}>
                Tecnologia da Informação
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              Alert.alert(
                "Editar perfil",
                "A função de edição de perfil ainda não foi implementada."
              )
            }
          >
            <Ionicons
              name="create-outline"
              size={18}
              color="#3F6FE5"
            />

            <Text
              style={styles.secondaryButtonText}
            >
              Editar informações
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// =====================================================
// TELA DE NOVA REQUISIÇÃO
// =====================================================

function NovaRequisicaoScreen({ onNavigate }) {
  const [tipo, setTipo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");

  const tipos = [
    {
      nome: "Suporte",
      icone: "headset-outline",
    },
    {
      nome: "Manutenção",
      icone: "construct-outline",
    },
    {
      nome: "Infraestrutura",
      icone: "business-outline",
    },
    {
      nome: "Rede",
      icone: "wifi-outline",
    },
    {
      nome: "Outro",
      icone:
        "ellipsis-horizontal-circle-outline",
    },
  ];

  const enviarRequisicao = () => {
    if (
      !tipo ||
      !titulo.trim() ||
      !descricao.trim()
    ) {
      Alert.alert(
        "Atenção",
        "Preencha o tipo, título e descrição."
      );
      return;
    }

    /*
      Aqui mantemos a mesma lógica do segundo código:
      a tela funciona como protótipo.

      Quando você tiver o endpoint de criação das
      requisições no Spring Boot, este método pode ser
      conectado ao backend.
    */

    Alert.alert(
      "Sucesso",
      "Solicitação criada com sucesso!",
      [
        {
          text: "OK",
          onPress: () =>
            onNavigate("home"),
        },
      ]
    );
  };

  return (
    <View style={styles.homeContainer}>
      <View style={styles.innerHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate("home")}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.innerHeaderTitle}>
          Nova Solicitação
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={
          styles.newRequestScroll
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            Criar nova requisição
          </Text>

          <Text style={styles.formSubtitle}>
            Preencha as informações abaixo.
          </Text>

          <Text style={styles.label}>
            Tipo de solicitação
          </Text>

          <View style={styles.typeGrid}>
            {tipos.map((item) => (
              <TouchableOpacity
                key={item.nome}
                style={[
                  styles.typeButton,
                  tipo === item.nome &&
                    styles.typeButtonSelected,
                ]}
                onPress={() =>
                  setTipo(item.nome)
                }
              >
                <Ionicons
                  name={item.icone}
                  size={19}
                  color={
                    tipo === item.nome
                      ? "#FFFFFF"
                      : "#3F6FE5"
                  }
                />

                <Text
                  style={[
                    styles.typeButtonText,
                    tipo === item.nome &&
                      styles.typeButtonTextSelected,
                  ]}
                >
                  {item.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Campo
            label="Título"
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex.: Computador não liga"
            icon="text-outline"
          />

          <Campo
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o problema ou solicitação"
            icon="document-text-outline"
            multiline
          />

          <Campo
            label="Local"
            value={local}
            onChangeText={setLocal}
            placeholder="Ex.: Laboratório 02"
            icon="location-outline"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={enviarRequisicao}
          >
            <Ionicons
              name="send-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.primaryButtonText}>
              Enviar solicitação
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// =====================================================
// APP PRINCIPAL / NAVEGAÇÃO
// =====================================================

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState("login");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      {currentScreen === "login" && (
        <LoginScreen
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === "cadastro" && (
        <CadastroScreen
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === "home" && (
        <HomeScreen
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === "usuario" && (
        <UsuarioScreen
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === "novaRequisicao" && (
        <NovaRequisicaoScreen
          onNavigate={setCurrentScreen}
        />
      )}
    </KeyboardAvoidingView>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  // =========================
  // LOGIN / CADASTRO
  // =========================

  screen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
  },

  appIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#3F6FE5",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  title: {
    textAlign: "center",
    color: "#202124",
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    textAlign: "center",
    color: "#777E87",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 24,
  },

  fieldContainer: {
    marginBottom: 14,
  },

  label: {
    color: "#40454D",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },

  inputContainer: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E0E3E8",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  inputContainerMultiline: {
    height: 110,
    alignItems: "flex-start",
    paddingTop: 12,
  },

  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },

  inputIconTop: {
    marginLeft: 12,
    marginRight: 8,
    marginTop: 2,
  },

  input: {
    flex: 1,
    height: "100%",
    color: "#292D32",
    fontSize: 13,
    paddingRight: 12,
  },

  inputMultiline: {
    paddingTop: 0,
    paddingBottom: 10,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 16,
  },

  forgotText: {
    color: "#3769D4",
    fontSize: 11,
    fontWeight: "500",
  },

  primaryButton: {
    height: 46,
    backgroundColor: "#3F6FE5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 4,

    shadowColor: "#3F6FE5",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  bottomText: {
    textAlign: "center",
    color: "#7B8189",
    fontSize: 12,
    marginTop: 20,
  },

  link: {
    color: "#3266D5",
    fontWeight: "600",
  },

  // =========================
  // TURMAS
  // =========================

  turmaContainer: {
    marginBottom: 18,
  },

  turmaButton: {
    height: 44,
    backgroundColor: "#E8ECF4",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  turmaButtonSelected: {
    backgroundColor: "#3F6FE5",
  },

  turmaButtonText: {
    color: "#40454D",
    fontSize: 13,
    fontWeight: "600",
  },

  turmaButtonTextSelected: {
    color: "#FFFFFF",
  },

  // =========================
  // HOME
  // =========================

  homeContainer: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  headerBar: {
    height: 64,
    backgroundColor: "#3F6FE5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    elevation: 4,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerButton: {
    padding: 6,
    marginRight: 4,
  },

  logoutButton: {
    padding: 6,
  },

  homeScroll: {
    padding: 20,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },

  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  welcomeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#202124",
    flex: 1,
  },

  newButton: {
    backgroundColor: "#3F6FE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },

  newButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  // =========================
  // CARDS DAS SOLICITAÇÕES
  // =========================

  chamadoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E3E8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  chamadoCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: "#777E87",
    textTransform: "uppercase",
    flex: 1,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },

  badgePendente: {
    backgroundColor: "#FEF3C7",
  },

  badgeResolvido: {
    backgroundColor: "#D1FAE5",
  },

  badgeNegada: {
    backgroundColor: "#FEE2E2",
  },

  badgeNovo: {
    backgroundColor: "#DBEAFE",
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },

  badgeTextPendente: {
    color: "#92400E",
  },

  badgeTextResolvido: {
    color: "#065F46",
  },

  badgeTextNegada: {
    color: "#991B1B",
  },

  badgeTextNovo: {
    color: "#1E40AF",
  },

  chamadoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#202124",
    marginBottom: 12,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
    paddingTop: 10,
  },

  chamadoDate: {
    fontSize: 11,
    color: "#9AA0A6",
  },

  // =========================
  // NENHUM RESULTADO
  // =========================

  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E3E8",
    padding: 35,
    alignItems: "center",
    marginTop: 20,
  },

  emptyTitle: {
    color: "#40454D",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },

  emptyText: {
    color: "#9AA0A6",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },

  // =========================
  // HEADER INTERNO
  // =========================

  innerHeader: {
    height: 64,
    backgroundColor: "#3F6FE5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    elevation: 4,
  },

  innerHeaderTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  backButton: {
    padding: 5,
    width: 40,
  },

  headerSpacer: {
    width: 40,
  },

  // =========================
  // PERFIL
  // =========================

  profileScroll: {
    padding: 20,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E0E3E8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EAF0FF",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  profileName: {
    textAlign: "center",
    fontSize: 21,
    fontWeight: "700",
    color: "#202124",
  },

  profileSubtitle: {
    textAlign: "center",
    fontSize: 12,
    color: "#777E87",
    marginTop: 4,
  },

  profileDivider: {
    height: 1,
    backgroundColor: "#F0F2F5",
    marginVertical: 22,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: "#9AA0A6",
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#292D32",
  },

  secondaryButton: {
    height: 46,
    borderWidth: 1,
    borderColor: "#3F6FE5",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  secondaryButtonText: {
    color: "#3F6FE5",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  // =========================
  // NOVA REQUISIÇÃO
  // =========================

  newRequestScroll: {
    padding: 20,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E3E8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  formTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#202124",
  },

  formSubtitle: {
    fontSize: 12,
    color: "#777E87",
    marginTop: 4,
    marginBottom: 22,
  },

  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },

  typeButton: {
    width: "48%",
    minHeight: 62,
    borderWidth: 1,
    borderColor: "#DCE1E8",
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginRight: "2%",
    marginBottom: 8,
  },

  typeButtonSelected: {
    backgroundColor: "#3F6FE5",
    borderColor: "#3F6FE5",
  },

  typeButtonText: {
    color: "#3F6FE5",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 5,
  },

  typeButtonTextSelected: {
    color: "#FFFFFF",
  },
});

