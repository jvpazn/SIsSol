package br.edu.ifpe.sistema_de_solicitacao.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ifpe.sistema_de_solicitacao.Model.instituicao;

@Repository
public interface InstituicaoDAO extends JpaRepository<instituicao, String> { 
}