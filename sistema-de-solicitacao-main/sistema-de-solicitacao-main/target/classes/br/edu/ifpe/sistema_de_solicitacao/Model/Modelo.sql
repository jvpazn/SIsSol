CREATE schema sistema_solicitacao; 
USE sistema_solicitacao; 

CREATE TABLE instituicao (
    codigo_inep VARCHAR(50) PRIMARY KEY
);

CREATE TABLE instituicao_ensino (
    codigo_inep VARCHAR(50) NOT NULL,
    ensino ENUM('INFANTIL', 'FUNDAMENTAL_I', 'FUNDAMENTAL_II', 'MEDIO', 'SUPERIOR') NOT NULL,
    PRIMARY KEY (codigo_inep, ensino),
    FOREIGN KEY (codigo_inep) REFERENCES instituicao(codigo_inep)
);

CREATE TABLE campus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE sala (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    campus_id BIGINT NOT NULL,
    FOREIGN KEY (campus_id) REFERENCES campus(id)
);

CREATE TABLE turma (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    campus_id BIGINT NOT NULL,
    FOREIGN KEY (campus_id) REFERENCES campus(id) 
);


CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    matricula VARCHAR(100) UNIQUE NOT NULL,
    instituicao_id VARCHAR(50) NOT NULL,
    tipo_usuario ENUM('ALUNO', 'PROFESSOR', 'TECNICO') NOT NULL, 
    FOREIGN KEY (instituicao_id) REFERENCES instituicao(codigo_inep)
);

-- Aluno
CREATE TABLE aluno (
    usuario_id BIGINT PRIMARY KEY,
    turma_id BIGINT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (turma_id) REFERENCES turma(id)
);

CREATE TABLE professor (
    usuario_id BIGINT PRIMARY KEY,
    cradt VARCHAR(100) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) 
);

CREATE TABLE tecnico (
    usuario_id BIGINT PRIMARY KEY,
    especialidade ENUM('SUPORTE_LOCAL', 'SISTEMAS_E_ACESSOS', 'INFRAESTRUTURA_REDES') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) 
);

CREATE TABLE requesicao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    tipo ENUM(
        'MANUTENCAO_COMPUTADOR', 'SUBSTITUICAO_EQUIPAMENTO', 'MANUTENCAO_CABOS',
        'INSTALACAO_EQUIPAMENTO', 'MANUTENCAO_PROJETOR', 'INSTALACAO_SOFTWARE_PADRAO',
        'INSTALACAO_SOFTWARE_ESPECIFICO', 'ATUALIZACAO_SISTEMA_OPERACIONAL',
        'RELATO_BUG_SISTEMA_INTERNO', 'RECUPERACAO_ARQUIVOS', 'CRIACAO_NOVO_USUARIO',
        'REDEFINICAO_SENHA', 'LIBERACAO_ACESSO_PASTAS', 'CRIACAO_EMAIL_INSTITUCIONAL',
        'BLOQUEIO_USUARIO', 'QUEDA_INTERNET', 'LIBERACAO_SITE_BLOQUEADO',
        'CRIACAO_PONTO_REDE', 'CONFIGURACAO_WIFI', 'CONFIGURACAO_VPN'
    ) NOT NULL,
    descricao TEXT NOT NULL,
    status ENUM('CONCLUIDO', 'AGUARDO', 'NEGADA') NOT NULL DEFAULT 'AGUARDO',
    feedback TEXT,
    usuario_id BIGINT NOT NULL, 
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE requesicao_sala (
    requesicao_id BIGINT NOT NULL,
    sala_id BIGINT NOT NULL,
    PRIMARY KEY (requesicao_id, sala_id),
    FOREIGN KEY (requesicao_id) REFERENCES requesicao(id),
    FOREIGN KEY (sala_id) REFERENCES sala(id) 
);
