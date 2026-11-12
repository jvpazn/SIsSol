# 🚀 Sistema de Solicitação - IFPE

Um sistema completo para gerenciamento de solicitações institucionais, projetado para atender às demandas do Instituto Federal de Pernambuco (IFPE). O projeto é um monorepo dividido em uma aplicação Mobile para os usuários finais e uma API Backend robusta para o gerenciamento das regras de negócio.

## 🛠 Tecnologias Utilizadas

### Backend
* **Java & Spring Boot**: Construção da API REST e lógica de negócios[cite: 4].
* **Maven**: Gerenciamento de dependências e build do projeto[cite: 4].
* **Arquitetura MVC**: Código estruturado de forma escalável utilizando Models, Controllers e DAOs[cite: 4].

### Mobile
* **React Native & Expo**: Desenvolvimento do aplicativo móvel multiplataforma (Android e iOS)[cite: 4].
* **JavaScript/Node.js**: Base do ecossistema frontend[cite: 4].

## ⚙️ Funcionalidades

O sistema possui uma modelagem de dados completa para gerenciar todo o fluxo acadêmico e administrativo:
* **Gestão de Usuários**: Controle e autenticação de diferentes perfis, incluindo Alunos, Professores e Técnicos[cite: 4].
* **Infraestrutura**: Gerenciamento de Instituições, Campus e Salas[cite: 4].
* **Controle Acadêmico**: Organização e gerenciamento de Turmas[cite: 4].
* **Fluxo de Solicitações**: Criação e acompanhamento de requisições, incluindo o controle de tipos de requisição e seus respectivos status[cite: 4].

## 📂 Estrutura do Projeto

O repositório contém dois diretórios principais que separam as responsabilidades do sistema:

- `/Mobile-Sistemas-de-requesi-o-main`: Contém todo o código-fonte do aplicativo móvel[cite: 4].
- `/sistema-de-solicitacao-main`: Contém o código-fonte da API Backend[cite: 4].

## 🚀 Como Executar Localmente

### 1. Configurando a API (Backend)
1. Navegue até o diretório do backend: 
   ```bash
   cd sistema-de-solicitacao-main
