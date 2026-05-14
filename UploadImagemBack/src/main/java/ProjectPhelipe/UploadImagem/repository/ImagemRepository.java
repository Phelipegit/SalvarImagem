package ProjectPhelipe.UploadImagem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ImagemRepository extends JpaRepository<ImagemEntity, UUID> {
}
