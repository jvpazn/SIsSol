package br.edu.ifpe.sistema_de_solicitacao.Model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(name = "tipo_usuario", nullable = false)
    private String tipoUsuario;

    @ManyToOne
    @JoinColumn(name = "instituicao_id", nullable = false)
    private instituicao instituicao;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<Requesicao> requesicoes;

    public Usuario() {
    }

    public Usuario(
        String nome,
        String senha,
        String matricula,
        String tipoUsuario,
        instituicao instituicao,
        List<Requesicao> requesicoes
    ) {
        this.nome = nome;
        this.senha = senha;
        this.matricula = matricula;
        this.tipoUsuario = tipoUsuario;
        this.instituicao = instituicao;
        this.requesicoes = requesicoes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public instituicao getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(instituicao instituicao) {
        this.instituicao = instituicao;
    }

    public List<Requesicao> getRequesicoes() {
        return requesicoes;
    }

    public void setRequesicoes(List<Requesicao> requesicoes) {
        this.requesicoes = requesicoes;
    }
}
