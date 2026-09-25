package br.edu.ifpe.sistema_de_solicitacao.Controller;

import br.edu.ifpe.sistema_de_solicitacao.DAO.RequesicaoDAO;
import br.edu.ifpe.sistema_de_solicitacao.Model.Requesicao;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requisicoes")
@CrossOrigin(origins = "*")
public class RequesicaoController {

    private final RequesicaoDAO requesicaoDAO;

    public RequesicaoController(RequesicaoDAO requesicaoDAO) {
        this.requesicaoDAO = requesicaoDAO;
    }

    @GetMapping
    public ResponseEntity<List<Requesicao>> listarTodas() {
        return ResponseEntity.ok(requesicaoDAO.findAll());
    }

    @PostMapping("/criar")
    public ResponseEntity<Requesicao> criar(@RequestBody Requesicao requesicao) {
        Requesicao novaReq = requesicaoDAO.save(requesicao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaReq);
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Requesicao> atualizar(@PathVariable Long id, @RequestBody Requesicao requesicaoAtualizada) {
        if (requesicaoDAO.existsById(id)) {
            requesicaoAtualizada.setId(id);
            Requesicao salva = requesicaoDAO.save(requesicaoAtualizada);
            return ResponseEntity.ok(salva);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (requesicaoDAO.existsById(id)) {
            requesicaoDAO.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
