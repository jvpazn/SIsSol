package br.edu.ifpe.sistema_de_solicitacao.Model;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "professor")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Professor extends Usuario {

    @Column (nullable = false)
    private String Cradt;

    public Professor(){
        
    }

    public Professor(String Cradt, String nome, String senha, String matricula, instituicao instituicao, List<Requesicao> requesicoes) {
        super(nome, senha, matricula, instituicao, requesicoes);
        this.Cradt = Cradt;
    }

    public String getCradt() {
        return this.Cradt;
    }

    public void setCradt(String Cradt) {
        this.Cradt = Cradt;
    }

}
