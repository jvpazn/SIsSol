package br.edu.ifpe.sistema_de_solicitacao.DAO;

import br.edu.ifpe.sistema_de_solicitacao.Model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorDAO extends JpaRepository<Professor, Long>{
    
}