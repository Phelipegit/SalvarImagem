package ProjectPhelipe.UploadImagem.controller;

import ProjectPhelipe.UploadImagem.model.ImagemRequest;
import ProjectPhelipe.UploadImagem.model.ImagemResponse;
import ProjectPhelipe.UploadImagem.model.ReturnDB;
import ProjectPhelipe.UploadImagem.service.DeletarTodasLinhasDB;
import ProjectPhelipe.UploadImagem.service.DevolverImagensDB;
import ProjectPhelipe.UploadImagem.service.SalvarImagem;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class Controller {

    private final SalvarImagem salvarImagem;

    private final DevolverImagensDB devolverImagensDB;

    private final DeletarTodasLinhasDB deletarTodasLinhasDB;

    public Controller(SalvarImagem salvarImagem, DevolverImagensDB devolverImagensDB, DeletarTodasLinhasDB deletarTodasLinhasDB) {
        this.salvarImagem = salvarImagem;
        this.devolverImagensDB = devolverImagensDB;
        this.deletarTodasLinhasDB = deletarTodasLinhasDB;
    }

    @PostMapping("/addImage")
    public ImagemResponse salvarImagem(@RequestBody ImagemRequest imagemRequest) throws IOException, InterruptedException {
        return salvarImagem.salvarImagem(imagemRequest);
    }

    @GetMapping("/devolvertudo")
    public List<ReturnDB> devolverTudo() {
        return devolverImagensDB.devolverImagensDB();
    }

    @DeleteMapping("/apagartudo")
    public void deletarTudo() {
        deletarTodasLinhasDB.deletarTodasLinhas();
    }
}
