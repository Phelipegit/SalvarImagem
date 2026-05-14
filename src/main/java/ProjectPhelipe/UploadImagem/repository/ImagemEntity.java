package ProjectPhelipe.UploadImagem.repository;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
public class ImagemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String url;

    private LocalDateTime localDateTime;

    public ImagemEntity(String url) {
        this.url = url;
        this.localDateTime = LocalDateTime.now();
    }

    public ImagemEntity() {

    }
}
