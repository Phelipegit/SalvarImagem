package ProjectPhelipe.UploadImagem.service;

import ProjectPhelipe.UploadImagem.repository.ImagemRepository;
import org.springframework.stereotype.Service;

@Service
public class DeletarTodasLinhasDB {

    private final ImagemRepository imagemRepository;

    public DeletarTodasLinhasDB(ImagemRepository imagemRepository) {
        this.imagemRepository = imagemRepository;
    }

    public void deletarTodasLinhas() {
        imagemRepository.deleteAll();
    }
}
