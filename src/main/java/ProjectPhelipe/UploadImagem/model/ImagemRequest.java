package ProjectPhelipe.UploadImagem.model;

import lombok.Getter;

@Getter
public class ImagemRequest {

    private String imagemCodificada;


    public ImagemRequest(String imagemCodificada) {
        this.imagemCodificada = imagemCodificada;
    }

    public String getImagemCodificada() {
        return this.imagemCodificada;
    }
}
