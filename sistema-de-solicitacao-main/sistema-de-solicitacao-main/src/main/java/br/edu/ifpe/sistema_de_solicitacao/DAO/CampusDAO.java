package br.edu.ifpe.sistema_de_solicitacao.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ifpe.sistema_de_solicitacao.Model.Campus;

@Repository
public interface CampusDAO extends JpaRepository<Campus, Long>{
    
}