package br.edu.ifpe.sistema_de_solicitacao.Model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "tecnico")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Tecnico extends Usuario {

    public enum EspecialidadeTecnico {
        SUPORTE_LOCAL,
        SISTEMAS_E_ACESSOS,
        INFRAESTRUTURA_REDES
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "especialidade", nullable = false)
    private EspecialidadeTecnico especialidadeTecnico;

    public Tecnico() {

    }

    public Tecnico(
            EspecialidadeTecnico EspecialidadeTecnico,
            String nome,
            String senha,
            String matricula,
            instituicao instituicao,
            List<Requesicao> requesicoes) {
        super(nome, senha, matricula, "TECNICO", instituicao, requesicoes);
        this.especialidadeTecnico = EspecialidadeTecnico;
    }

    public EspecialidadeTecnico getEspecialidadeTecnico() {
        return this.especialidadeTecnico;
    }

    public void setEspecialidadeTecnico(EspecialidadeTecnico EspecialidadeTecnico) {
        this.especialidadeTecnico = EspecialidadeTecnico;
    }

}
