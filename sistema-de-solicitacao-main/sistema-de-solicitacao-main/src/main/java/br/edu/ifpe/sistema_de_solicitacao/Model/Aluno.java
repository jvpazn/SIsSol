package br.edu.ifpe.sistema_de_solicitacao.Model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "aluno")
@PrimaryKeyJoinColumn(name = "usuario_id") 
public class Aluno extends Usuario {
    
    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false) 
    private Turmas turma;

    public Aluno() {
    }

    public Aluno(Turmas turma, String nome, String senha, String matricula, instituicao instituicao, List<Requesicao> requesicoes) {
        super(nome, senha, matricula, instituicao, requesicoes);
        this.turma = turma;
    }

    public Turmas getTurma() {
        return this.turma;
    }

    public void setTurma(Turmas turma) {
        this.turma = turma;
    }
}