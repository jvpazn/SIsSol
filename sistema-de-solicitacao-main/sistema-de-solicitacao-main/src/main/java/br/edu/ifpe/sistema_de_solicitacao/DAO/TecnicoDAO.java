package br.edu.ifpe.sistema_de_solicitacao.DAO;

import br.edu.ifpe.sistema_de_solicitacao.Model.Tecnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TecnicoDAO extends JpaRepository<Tecnico, Long>{
    
}