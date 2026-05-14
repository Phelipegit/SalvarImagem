package ProjectPhelipe.UploadImagem.service;

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

    public List<ImagemEntity> devolverImagensDB() {
        return imagemRepository.findAll();
    }
}
