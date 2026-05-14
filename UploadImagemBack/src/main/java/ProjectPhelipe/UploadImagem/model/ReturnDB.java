package ProjectPhelipe.UploadImagem.model;

import java.time.LocalDateTime;

public class ReturnDB {

    public String url;

    public LocalDateTime localDateTime;

    public ReturnDB(String url, LocalDateTime localDateTime) {
        this.url = url;
        this.localDateTime = localDateTime;
    }

    public String getUrl() {
        return url;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }
}
