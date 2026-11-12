package br.edu.ifpe.sistema_de_solicitacao.Model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "aluno")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Aluno extends Usuario {

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turmas turma;

    public Aluno() {
        super();
    }

    public Aluno(
        Turmas turma,
        String nome,
        String senha,
        String matricula,
        instituicao instituicao,
        List<Requesicao> requesicoes
    ) {
        super(
            nome,
            senha,
            matricula,
            "ALUNO",
            instituicao,
            requesicoes
        );

        this.turma = turma;
    }

    public Turmas getTurma() {
        return turma;
    }

    public void setTurma(Turmas turma) {
        this.turma = turma;
    }
}
