package ProjectPhelipe.UploadImagem.service;

import ProjectPhelipe.UploadImagem.model.ImagemRequest;
import ProjectPhelipe.UploadImagem.model.ImagemResponse;
import ProjectPhelipe.UploadImagem.model.ObterUrlRecord;
import ProjectPhelipe.UploadImagem.repository.ImagemEntity;
import ProjectPhelipe.UploadImagem.repository.ImagemRepository;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Service
public class SalvarImagem {

    private final ImagemRepository imagemRepository;

    public SalvarImagem(ImagemRepository imagemRepository) {
        this.imagemRepository = imagemRepository;
    }

    public ImagemResponse salvarImagem(ImagemRequest request) throws IOException, InterruptedException {
        ChamarRequestApi chamarRequestApi = new ChamarRequestApi();

        ObjectMapper objectMapper = new ObjectMapper();

        ObterUrlRecord record = objectMapper.readValue(chamarRequestApi.chamarApi(request.getImagemCodificada()),ObterUrlRecord.class);

        ImagemEntity imagemEntity = new ImagemEntity(record.secure_url());

        imagemRepository.save(imagemEntity);

        return new ImagemResponse(true,"Imagem enviada com sucesso");
    }
}
