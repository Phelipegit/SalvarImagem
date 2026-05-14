package ProjectPhelipe.UploadImagem.service;

import ProjectPhelipe.UploadImagem.repository.ImagemEntity;
import ProjectPhelipe.UploadImagem.repository.ImagemRepository;

import java.util.List;

public class DevolverImagensDB {

    private final ImagemRepository imagemRepository;

    public DevolverImagensDB(ImagemRepository imagemRepository) {
        this.imagemRepository = imagemRepository;
    }

    public List<ImagemEntity> devolverImagensDB() {
        return imagemRepository.findAll();
    }
}
