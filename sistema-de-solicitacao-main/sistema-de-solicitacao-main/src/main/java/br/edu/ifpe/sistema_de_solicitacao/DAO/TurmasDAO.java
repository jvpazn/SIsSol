package br.edu.ifpe.sistema_de_solicitacao.DAO;

import br.edu.ifpe.sistema_de_solicitacao.Model.Turmas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TurmasDAO extends JpaRepository<Turmas, Long>{
    
}