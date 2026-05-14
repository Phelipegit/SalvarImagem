package ProjectPhelipe.UploadImagem.model;

public class ImagemResponse {

    private boolean success;

    private String message;

    public ImagemResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
