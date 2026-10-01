package br.edu.ifpe.sistema_de_solicitacao.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifpe.sistema_de_solicitacao.DAO.AlunoDAO;
import br.edu.ifpe.sistema_de_solicitacao.DAO.InstituicaoDAO;
import br.edu.ifpe.sistema_de_solicitacao.DAO.TurmasDAO;
import br.edu.ifpe.sistema_de_solicitacao.DAO.UsuarioDAO;
import br.edu.ifpe.sistema_de_solicitacao.Model.Aluno;
import br.edu.ifpe.sistema_de_solicitacao.Model.Turmas;
import br.edu.ifpe.sistema_de_solicitacao.Model.Usuario;
import br.edu.ifpe.sistema_de_solicitacao.Model.instituicao;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioDAO usuarioDAO;
    private final AlunoDAO alunoDAO;
    private final InstituicaoDAO instituicaoDAO;
    private final TurmasDAO turmasDAO;

    public UsuarioController(
        UsuarioDAO usuarioDAO,
        AlunoDAO alunoDAO,
        InstituicaoDAO instituicaoDAO,
        TurmasDAO turmasDAO
    ) {
        this.usuarioDAO = usuarioDAO;
        this.alunoDAO = alunoDAO;
        this.instituicaoDAO = instituicaoDAO;
        this.turmasDAO = turmasDAO;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioDAO.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping("/criar")
    public ResponseEntity<?> criar(@RequestBody CadastroAlunoDTO dados) {

        try {

            // Verifica se a matrícula já existe
            Optional<Usuario> usuarioExistente =
                usuarioDAO.findByMatricula(dados.getMatricula());

            if (usuarioExistente.isPresent()) {
                return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("A matrícula já está cadastrada.");
            }

            // Busca a instituição
            Optional<instituicao> instituicaoOpt =
                instituicaoDAO.findById("26012345");

            if (instituicaoOpt.isEmpty()) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Instituição não encontrada.");
            }

            // Busca a turma
            Optional<Turmas> turmaOpt =
                turmasDAO.findById(dados.getTurmaId());

            if (turmaOpt.isEmpty()) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Turma não encontrada.");
            }

            instituicao instituicao = instituicaoOpt.get();
            Turmas turma = turmaOpt.get();

            // Cria o aluno
            Aluno aluno = new Aluno(
                turma,
                dados.getNome(),
                dados.getSenha(),
                dados.getMatricula(),
                instituicao,
                null
            );

            // Salva em usuario + aluno
            Aluno novoAluno = alunoDAO.save(aluno);

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoAluno);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    "Erro ao criar usuário: " +
                    e.getMessage()
                );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(
        @RequestBody Usuario dadosLogin
    ) {

        Optional<Usuario> usuario =
            usuarioDAO.findByMatriculaAndSenha(
                dadosLogin.getMatricula(),
                dadosLogin.getSenha()
            );

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        }

        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .build();
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletar(
        @PathVariable Long id
    ) {

        if (usuarioDAO.existsById(id)) {
            usuarioDAO.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
