package DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Sprite {

    @JsonProperty("front_default")
    private String frontDefault;

    public String getFrontDefault(){
        return frontDefault;
    }

    public void setFrontDefault(String frontDefault){
        this.frontDefault = frontDefault;
    }
}
