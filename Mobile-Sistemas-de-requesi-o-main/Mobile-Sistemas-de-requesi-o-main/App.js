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

const API_URL = "http://10.31.35.108:8080/api";

// =====================================================
// COMPONENTES REUTILIZÁVEIS
// =====================================================

function AppIcon() {
  return (
    <View style={styles.appIcon}>
      <Ionicons name="person-outline" size={26} color="#FFFFFF" />
    </View>
  );
}

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
          style={multiline ? styles.inputIconTop : styles.inputIcon}
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

// Menu suspenso personalizado
function Dropdown({
  label,
  value,
  onValueChange,
  options,
  placeholder,
}) {
  const [aberto, setAberto] = useState(false);

  const selecionado = options.find(
    (item) => item.value === value
  );

  return (
    <View
      style={[
        styles.dropdownWrapper,
        aberto && styles.dropdownWrapperOpen,
      ]}
    >
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.dropdownButton,
          aberto && styles.dropdownButtonOpen,
        ]}
        onPress={() => setAberto((estado) => !estado)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dropdownText,
            !selecionado && styles.dropdownPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selecionado ? selecionado.label : placeholder}
        </Text>

        <Ionicons
          name={aberto ? "chevron-up" : "chevron-down"}
          size={18}
          color="#737B89"
        />
      </TouchableOpacity>

      {aberto && (
        <View style={styles.dropdownOptions}>
          <ScrollView
            style={styles.dropdownList}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {options.map((item) => {
              const ativo = item.value === value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.dropdownOption,
                    ativo && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setAberto(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      ativo &&
                        styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>

                  {ativo && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color="#3F6FE5"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
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
            senha,
          }),
        }
      );

      const resultado = await resposta.text();

      console.log("Resposta do login:", resultado);

      if (resposta.ok) {
        onNavigate("home");
      } else {
        Alert.alert(
          "Login inválido",
          "Matrícula ou senha incorretos!"
        );
      }
    } catch (erro) {
      console.error("Erro ao conectar com o backend:", erro);

      Alert.alert(
        "Erro de conexão",
        "Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando e se o IP está correto."
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
            senha,
            turmaId,
          }),
        }
      );

      const resultado = await resposta.text();

      console.log("Resposta do cadastro:", resultado);

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
      } else {
        Alert.alert(
          "Erro no cadastro",
          resultado || "Não foi possível cadastrar o usuário."
        );
      }
    } catch (erro) {
      console.error("Erro ao conectar com o backend:", erro);

      Alert.alert(
        "Erro de conexão",
        "Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando."
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
// TELA INICIAL
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

        console.log("Requisições recebidas:", dados);

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
        "Erro ao conectar com o backend:",
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
        <Text style={styles.headerTitle}>SISOL</Text>

        <View style={styles.headerActions}>
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

      <ScrollView contentContainerStyle={styles.homeScroll}>
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>
            Pedidos de Solicitação
          </Text>

          <TouchableOpacity
            style={styles.newButton}
            onPress={() => onNavigate("novaRequisicao")}
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
              size={40}
              color="#9AA0A6"
            />

            <Text style={styles.emptyTitle}>
              Nenhuma solicitação
            </Text>

            <Text style={styles.emptyText}>
              Você ainda não possui solicitações cadastradas.
            </Text>
          </View>
        ) : (
          chamados.map((item, index) => {
            const statusStyle = getStatusStyle(item.status);

            return (
              <View
                key={item.id ?? index}
                style={styles.chamadoCard}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.chamadoCategory}>
                    {item.tipo
                      ? item.tipo.replace(/_/g, " ")
                      : "Solicitação"}
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

                <Text style={styles.chamadoTitle}>
                  {item.tipo || "Equipamento"}
                </Text>

                <Text style={styles.infoValue}>
                  {item.descricao || "Sem descrição"}
                </Text>

                {item.local ? (
                  <Text style={styles.chamadoDate}>
                    Local: {item.local}
                  </Text>
                ) : null}

                <View style={styles.cardFooter}>
                  <Text style={styles.chamadoDate}>
                    {item.data
                      ? `Data: ${item.data}`
                      : "Data não informada"}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

// =====================================================
// TELA DE PERFIL
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

      <ScrollView contentContainerStyle={styles.profileScroll}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons
              name="person-outline"
              size={48}
              color="#3F6FE5"
            />
          </View>

          <Text style={styles.profileName}>
            Usuário SISOL
          </Text>

          <Text style={styles.profileSubtitle}>
            Informações da conta
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
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>
                Usuário cadastrado
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
              <Text style={styles.infoLabel}>Setor</Text>
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

            <Text style={styles.secondaryButtonText}>
              Editar informações
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// =====================================================
// TELA DE NOVA SOLICITAÇÃO
// =====================================================

function NovaRequisicaoScreen({ onNavigate }) {
  const [equipamento, setEquipamento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [carregando, setCarregando] = useState(false);

  const tiposRequisicao = [
    {
      label: "Instalação de equipamento",
      value: "INSTALACAO_EQUIPAMENTO",
    },
    {
      label: "Configuração de VPN",
      value: "CONFIGURACAO_VPN",
    },
    {
      label: "Configuração de Wi-Fi",
      value: "CONFIGURACAO_WIFI",
    },
    {
      label: "Instalação de software padrão",
      value: "INSTALACAO_SOFTWARE_PADRAO",
    },
    {
      label: "Substituição de equipamento",
      value: "SUBSTITUICAO_EQUIPAMENTO",
    },
    {
      label: "Manutenção de cabos",
      value: "MANUTENCAO_CABOS",
    },
    {
      label: "Manutenção de projetor",
      value: "MANUTENCAO_PROJETOR",
    },
    {
      label: "Queda de internet",
      value: "QUEDA_INTERNET",
    },
    {
      label: "Manutenção de computador",
      value: "MANUTENCAO_COMPUTADOR",
    },
    {
      label: "Instalação de software específico",
      value: "INSTALACAO_SOFTWARE_ESPECIFICO",
    },
  ];

  const locaisRequisicao = [
  { label: "Lab 01", value: "1" },
  { label: "Lab 02", value: "2" },
  { label: "Lab 03", value: "3" },
  { label: "Lab 04", value: "4" },
  { label: "Lab 05", value: "5" },
  { label: "Lab 06", value: "6" },
  { label: "Lab 07", value: "7" },
  { label: "Lab 08", value: "8" },
];

  
const enviarRequisicao = async () => {
  if (!equipamento || !descricao.trim() || !local) {
    Alert.alert(
      "Atenção",
      "Selecione o tipo, o laboratório e preencha a descrição."
    );
    return;
  }


  const salaId = salasPorNome[local];

  const usuarioId = usuarioLogadoId;

  if (!salaId || !usuarioId) {
    Alert.alert(
      "Dados incompletos",
      "Não foi possível identificar a sala ou o usuário. Confira os IDs do banco e o login."
    );
    return;
  }

  setCarregando(true);

  try {
    const corpo = {
  tipo: equipamento,
  descricao: descricao.trim(),
  data: new Date().toISOString().slice(0, 10),
  status: "AGUARDO",
  locais: [{ id: Number(local) }],
  usuario: { id: Number(usuarioLogadoId) },
};

    const url = `${API_URL}/requisicoes/criar`;

    console.log("POST:", url);
    console.log("JSON:", JSON.stringify(corpo, null, 2));

    const resposta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(corpo),
    });

    const texto = await resposta.text();

    console.log("HTTP:", resposta.status);
    console.log("Resposta:", texto);

    if (!resposta.ok) {
      Alert.alert(
        `Erro HTTP ${resposta.status}`,
        texto || "O servidor não conseguiu salvar a solicitação."
      );
      return;
    }

    Alert.alert(
      "Solicitação enviada!",
      "O servidor confirmou o cadastro.",
      [{
        text: "OK",
        onPress: () => {
          setEquipamento("");
          setDescricao("");
          setLocal("");
          onNavigate("home");
        },
      }]
    );
  } catch (erro) {
    console.error("Erro ao enviar:", erro);

    Alert.alert(
      "Erro de conexão",
      `${String(erro)}. Confira o endereço da API e o servidor.`
    );
  } finally {
    setCarregando(false);
  }
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
        contentContainerStyle={styles.newRequestScroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            Criar nova solicitação
          </Text>

          <Text style={styles.formSubtitle}>
            Selecione o equipamento e descreva o que está acontecendo.
          </Text>

          <Dropdown
            label="Equipamento ou item"
            value={equipamento}
            onValueChange={setEquipamento}
            options={tiposRequisicao}
            placeholder="Selecione o tipo de solicitação"
          />


          <Dropdown
            label="Local"
            value={local}
            onValueChange={setLocal}
            options={locaisRequisicao}
            placeholder="Selecione o laboratório"
          />

          <Campo
            label="Descrição do problema"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Ex.: O monitor não liga ou o cabo está danificado"
            icon="document-text-outline"
            multiline
          />

          <TouchableOpacity
            style={[
              styles.primaryButton,
              carregando && { opacity: 0.7 },
            ]}
            onPress={enviarRequisicao}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name="send-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.primaryButtonText}>
                  Enviar solicitação
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {currentScreen === "login" && (
        <LoginScreen onNavigate={setCurrentScreen} />
      )}

      {currentScreen === "cadastro" && (
        <CadastroScreen onNavigate={setCurrentScreen} />
      )}

      {currentScreen === "home" && (
        <HomeScreen onNavigate={setCurrentScreen} />
      )}

      {currentScreen === "usuario" && (
        <UsuarioScreen onNavigate={setCurrentScreen} />
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
    shadowOffset: { width: 0, height: 5 },
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
    minHeight: 46,
    backgroundColor: "#3F6FE5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 4,
    paddingHorizontal: 12,
    shadowColor: "#3F6FE5",
    shadowOffset: { width: 0, height: 3 },
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

  chamadoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E3E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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

  // Estilos do menu personalizado
  dropdownWrapper: {
    marginBottom: 14,
    width: "100%",
    position: "relative",
    zIndex: 10,
  },

  dropdownWrapperOpen: {
    zIndex: 100,
    elevation: 10,
  },

  dropdownButton: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#E0E3E8",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownButtonOpen: {
    borderColor: "#3F6FE5",
  },

  dropdownText: {
    flex: 1,
    color: "#292D32",
    fontSize: 13,
    marginRight: 10,
  },

  dropdownPlaceholder: {
    color: "#9AA0A6",
  },

  dropdownOptions: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#E0E3E8",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    elevation: 8,
    zIndex: 1000,
  },

  dropdownList: {
    maxHeight: 210,
  },

  dropdownOption: {
    minHeight: 43,
    paddingHorizontal: 13,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },

  dropdownOptionSelected: {
    backgroundColor: "#EEF3FF",
  },

  dropdownOptionText: {
    flex: 1,
    fontSize: 13,
    color: "#40454D",
    marginRight: 8,
  },

  dropdownOptionTextSelected: {
    color: "#3F6FE5",
    fontWeight: "600",
  },
});
