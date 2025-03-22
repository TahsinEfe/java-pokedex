package DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EvolutionDetail {
    private Species species;
    private List<EvolutionDetail> evolves_to;

    public Species getSpecies() {
        return species;
    }

    public void setSpecies(Species species) {
        this.species = species;
    }

    public List<EvolutionDetail> getEvolvesTo() {
        return evolves_to;
    }

    public void setEvolvesTo(List<EvolutionDetail> evolves_to) {
        this.evolves_to = evolves_to;
    }
}
