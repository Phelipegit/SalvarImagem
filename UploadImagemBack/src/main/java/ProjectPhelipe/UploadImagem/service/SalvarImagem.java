package ProjectPhelipe.UploadImagem.service;

import ProjectPhelipe.UploadImagem.model.ImagemRequest;
import ProjectPhelipe.UploadImagem.model.ImagemResponse;
import ProjectPhelipe.UploadImagem.model.ObterUrlRecord;
import ProjectPhelipe.UploadImagem.repository.ImagemEntity;
import ProjectPhelipe.UploadImagem.repository.ImagemRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Service
public class SalvarImagem {

    private final ChamarRequestApi chamarRequestApi;
    private final ImagemRepository imagemRepository;
    private final ObjectMapper objectMapper;

    public SalvarImagem(ChamarRequestApi chamarRequestApi,ImagemRepository imagemRepository,ObjectMapper objectMapper) {
        this.chamarRequestApi = chamarRequestApi;
        this.imagemRepository = imagemRepository;
        this.objectMapper = objectMapper;
    }

    @CacheEvict("imagens")
    public ImagemResponse salvarImagem(ImagemRequest request) throws IOException, InterruptedException {


        ObterUrlRecord record = objectMapper.readValue(chamarRequestApi.chamarApi(request.getImagemCodificada()),ObterUrlRecord.class);

        System.out.println(record.secure_url());
        ImagemEntity imagemEntity = new ImagemEntity(record.secure_url());

        imagemRepository.save(imagemEntity);

        return new ImagemResponse(true,"Imagem enviada com sucesso");
    }
}
