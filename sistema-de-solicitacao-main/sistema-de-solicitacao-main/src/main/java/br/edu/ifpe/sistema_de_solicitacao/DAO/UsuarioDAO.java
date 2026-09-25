package br.edu.ifpe.sistema_de_solicitacao.DAO;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ifpe.sistema_de_solicitacao.Model.Usuario;

@Repository
public interface UsuarioDAO extends JpaRepository<Usuario, Long>{
    Optional<Usuario> findByMatriculaAndSenha(String matricula, String senha);
}