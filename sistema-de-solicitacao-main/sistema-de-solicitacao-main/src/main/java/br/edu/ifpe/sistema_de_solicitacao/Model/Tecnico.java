package br.edu.ifpe.sistema_de_solicitacao.Model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "tecnico")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Tecnico extends Usuario{
    
public enum EspecialidadeTecnico {
    SUPORTE_LOCAL,
    SISTEMAS_E_ACESSOS,
    INFRAESTRUTURA_REDES
}
    @Enumerated(EnumType.STRING)
    @Column(name = "especialidade", nullable = false)
    private EspecialidadeTecnico especialidadeTecnico;

    public Tecnico(){

    }

    public Tecnico(EspecialidadeTecnico EspecialidadeTecnico, String nome, String senha, String matricula, instituicao instituicao, List<Requesicao> requesicoes) {
        super(nome, senha, matricula, instituicao, requesicoes);
        this.especialidadeTecnico = EspecialidadeTecnico;
    }


    public EspecialidadeTecnico getEspecialidadeTecnico() {
        return this.especialidadeTecnico;
    }

    public void setEspecialidadeTecnico(EspecialidadeTecnico EspecialidadeTecnico) {
        this.especialidadeTecnico = EspecialidadeTecnico;
    }


}
