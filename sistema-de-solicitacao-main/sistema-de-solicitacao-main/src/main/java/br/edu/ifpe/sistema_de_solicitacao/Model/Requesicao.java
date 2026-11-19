package br.edu.ifpe.sistema_de_solicitacao.Model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

enum StatusRequesicao {
    CONCLUIDO,
    AGUARDO,
    NEGADA
}

enum TipoRequisicao {
    MANUTENCAO_COMPUTADOR,
    SUBSTITUICAO_EQUIPAMENTO,
    MANUTENCAO_CABOS,
    INSTALACAO_EQUIPAMENTO,
    MANUTENCAO_PROJETOR,
    INSTALACAO_SOFTWARE_PADRAO,
    INSTALACAO_SOFTWARE_ESPECIFICO,
    ATUALIZACAO_SISTEMA_OPERACIONAL,
    RELATO_BUG_SISTEMA_INTERNO,
    RECUPERACAO_ARQUIVOS,
    CRIACAO_NOVO_USUARIO,
    REDEFINICAO_SENHA,
    LIBERACAO_ACESSO_PASTAS,
    CRIACAO_EMAIL_INSTITUCIONAL,
    BLOQUEIO_USUARIO,
    QUEDA_INTERNET,
    LIBERACAO_SITE_BLOQUEADO,
    CRIACAO_PONTO_REDE,
    CONFIGURACAO_WIFI,
    CONFIGURACAO_VPN
}

@Entity
@Table(name = "requesicao")
public class Requesicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoRequisicao tipo;

    @Column(name = "descricao", columnDefinition = "TEXT", nullable = false)
    private String descricao;

    @ManyToMany
    @JoinTable(name = "requesicao_sala", joinColumns = @JoinColumn(name = "requesicao_id"), inverseJoinColumns = @JoinColumn(name = "sala_id"))
    private List<Sala> Locais;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusRequesicao status;

    @Column(name = "feedback", columnDefinition = "TEXT", nullable = true)
    private String feedback;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public Requesicao() {
    }

    public Requesicao(
            Long id,
            LocalDate data,
            TipoRequisicao tipo,
            String descricao,
            List<Sala> Locais,
            StatusRequesicao status,
            String feedback,
            Usuario usuario) {
        this.id = id;
        this.data = data;
        this.tipo = tipo;
        this.descricao = descricao;
        this.Locais = Locais;
        this.status = status;
        this.feedback = feedback;
        this.usuario = usuario;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getData() {
        return this.data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public TipoRequisicao getTipo() {
        return this.tipo;
    }

    public void setTipo(TipoRequisicao tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<Sala> getLocais() {
        return this.Locais;
    }

    public void setLocais(List<Sala> Locais) {
        this.Locais = Locais;
    }

    public StatusRequesicao getStatus() {
        return this.status;
    }

    public void setStatus(StatusRequesicao status) {
        this.status = status;
    }

    public String getFeedback() {
        return this.feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
