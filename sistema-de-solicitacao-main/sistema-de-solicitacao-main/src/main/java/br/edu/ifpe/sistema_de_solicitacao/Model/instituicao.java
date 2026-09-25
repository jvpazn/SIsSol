package br.edu.ifpe.sistema_de_solicitacao.Model;

import java.util.List;

import jakarta.persistence.*;

enum Ensino{
    INFANTIL,
    FUNDAMENTAL_I,
    FUNDAMENTAL_II,
    MEDIO,
    SUPERIOR
}



@Entity
@Table(name = "instituicao")
public class instituicao {

    @Id
    @Column(name = "codigo_inep", length = 50)
    private String codigoInep;

    @ElementCollection(targetClass = Ensino.class)
    @CollectionTable(name = "instituicao_ensino", joinColumns = @JoinColumn(name = "codigo_inep"))
    @Enumerated(EnumType.STRING)
    @Column(name = "ensino")
    private List<Ensino> ensino; 

    public instituicao(){

    }

    public instituicao(String codigoInep, List<Ensino> ensino) {
        this.codigoInep = codigoInep;
        this.ensino = ensino;
    }

    public String getCodigoInep() {
        return this.codigoInep;
    }

    public void setCodigoInep(String codigoInep) {
        this.codigoInep = codigoInep;
    }

    public List<Ensino> getEnsino() {
        return this.ensino;
    }

    public void setEnsino(List<Ensino> ensino) {
        this.ensino = ensino;
    }

}
