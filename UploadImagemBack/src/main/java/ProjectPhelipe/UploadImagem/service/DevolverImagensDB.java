package ProjectPhelipe.UploadImagem.service;

import ProjectPhelipe.UploadImagem.model.ReturnDB;
import ProjectPhelipe.UploadImagem.repository.ImagemRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.web.util.matcher.IpAddressMatcher;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DevolverImagensDB {

    private final ImagemRepository imagemRepository;

    public DevolverImagensDB(ImagemRepository imagemRepository) {
        this.imagemRepository = imagemRepository;
    }

    @Cacheable("imagens")
    public List<ReturnDB> devolverImagensDB() {
        return imagemRepository.findAll().stream().map(element -> new ReturnDB(element.getUrl(),element.getLocalDateTime())).toList();
    }
}
