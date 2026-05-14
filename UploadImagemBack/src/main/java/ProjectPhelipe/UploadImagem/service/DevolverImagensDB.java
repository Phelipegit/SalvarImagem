package ProjectPhelipe.UploadImagem.service;

import ProjectPhelipe.UploadImagem.model.ReturnDB;
import ProjectPhelipe.UploadImagem.repository.ImagemEntity;
import ProjectPhelipe.UploadImagem.repository.ImagemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DevolverImagensDB {

    private final ImagemRepository imagemRepository;

    public DevolverImagensDB(ImagemRepository imagemRepository) {
        this.imagemRepository = imagemRepository;
    }

    public List<ReturnDB> devolverImagensDB() {
        return imagemRepository.findAll().stream().map(element -> new ReturnDB(element.getUrl(),element.getLocalDateTime())).toList();
    }
}
