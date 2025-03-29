    package service;

    import org.springframework.http.HttpStatus;
    import org.springframework.stereotype.Service;
    import org.springframework.web.reactive.function.client.WebClient;
    import org.springframework.web.reactive.function.client.WebClientResponseException;
    import reactor.core.publisher.Mono;

    @Service
    public class PokeApiClient {

        private final WebClient webClient;

        public PokeApiClient(WebClient.Builder webClientBuilder){
            this.webClient = webClientBuilder.baseUrl("https://pokeapi.co/api/v2").build();
        }

        public Mono<String> getPokemonByName(String name) {
            return webClient.get()
                    .uri("/pokemon/{name}", name)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(),
                            response -> Mono.error(new RuntimeException("Pokémon Couldn't Find: " + name)))
                    .onStatus(status -> status.is5xxServerError(),
                            response -> Mono.error(new RuntimeException("PokéAPI Server Error!")))
                    .bodyToMono(String.class)
                    .onErrorResume(WebClientResponseException.class,
                            ex -> Mono.error(new RuntimeException("API Call Fail: " + ex.getMessage())));
        }
    }
