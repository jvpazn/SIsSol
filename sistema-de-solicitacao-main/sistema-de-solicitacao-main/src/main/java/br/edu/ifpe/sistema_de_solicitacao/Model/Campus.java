package br.edu.ifpe.sistema_de_solicitacao.Model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campus")
public class Campus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    @OneToMany(mappedBy = "campus")
    private List<Sala> salas = new ArrayList<>(); 

    public Campus() {
    }

    public Campus(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public void adicionarSala(Sala sala) {
        this.salas.add(sala);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public List<Sala> getSalas() { return salas; }
}