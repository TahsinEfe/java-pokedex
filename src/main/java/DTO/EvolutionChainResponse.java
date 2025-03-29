package DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EvolutionChainResponse {
    private EvolutionDetail chain;

    public EvolutionDetail getChain() {
        return chain;
    }

    public void setChain(EvolutionDetail chain) {
        this.chain = chain;
    }
}
