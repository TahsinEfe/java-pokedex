package DTO;

import java.util.List;

public class PokemonDetail {
    private int id;
    private String name;
    private int height;
    private int weight;
    private List<TypeWrapper> types;
    private Sprite sprites;

    public int getId() { return id; }
    public String getName() { return name; }
    public int getHeight() { return height; }
    public int getWeight() { return weight; }
    public List<TypeWrapper> getTypes() { return types; }
    public Sprite getSprites() { return sprites; }

    public static class TypeWrapper {
        private Type type;
        public Type getType() { return type; }
    }

    public static class Type {
        private String name;
        public String getName() { return name; }
    }

    public static class Sprite {
        private String front_default;
        public String getFront_default() { return front_default; }
    }
}

