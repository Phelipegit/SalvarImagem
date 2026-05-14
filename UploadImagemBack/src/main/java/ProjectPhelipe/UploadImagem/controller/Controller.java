package ProjectPhelipe.UploadImagem.controller;

import ProjectPhelipe.UploadImagem.model.ImagemRequest;
import ProjectPhelipe.UploadImagem.model.ImagemResponse;
import ProjectPhelipe.UploadImagem.repository.ImagemEntity;
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

    public Controller(SalvarImagem salvarImagem, DevolverImagensDB devolverImagensDB) {
        this.salvarImagem = salvarImagem;
        this.devolverImagensDB = devolverImagensDB;
    }

    @PostMapping("/addImage")
    public ImagemResponse salvarImagem(@RequestBody ImagemRequest imagemRequest) throws IOException, InterruptedException {
        return salvarImagem.salvarImagem(imagemRequest);
    }

    @GetMapping("/devolvertudo")
    public List<ImagemEntity> devolverTudo() {
        return devolverImagensDB.devolverImagensDB();
    }
}
