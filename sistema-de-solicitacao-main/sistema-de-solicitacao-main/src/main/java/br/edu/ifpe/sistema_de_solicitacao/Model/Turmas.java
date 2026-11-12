package br.edu.ifpe.sistema_de_solicitacao.Model;
import jakarta.persistence.*;

@Entity
@Table(name = "turma")
public class Turmas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "campus_id", nullable = false)
    private Campus campus; 
    
    public Turmas() {
        }
    public Turmas(Long id, String nome, Campus campus) {
        this.id = id;
        this.nome = nome;
        this.campus = campus;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Campus getCampus() { return campus; }
    public void setCampus(Campus campus) { this.campus = campus; }
    
    @Override
    public String toString() {
        return nome;
    }
}