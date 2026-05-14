package ProjectPhelipe.UploadImagem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class ChamarRequestApi {

    @Value("${URL_CLOUDINARY}")
    private String url;

    @Value("${UPLOAD_PRESET}")
    private String uploadPreset;

    public String chamarApi(String imagem64) throws IOException, InterruptedException {

        String body = "file=" + URLEncoder.encode(imagem64, StandardCharsets.UTF_8)
                + "&upload_preset=" + URLEncoder.encode(uploadPreset, StandardCharsets.UTF_8);
        HttpClient httpClient = HttpClient.newBuilder().build();


        HttpRequest httpRequest = HttpRequest.newBuilder().
                uri(URI.create(url)).
                header("Content-Type","application/x-www-form-urlencoded").
                POST(HttpRequest.BodyPublishers.ofString(body)).
                build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        return response.body();
    }
}
