package ProjectPhelipe.UploadImagem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ObterUrlRecord(String secure_url, String format) {
}
