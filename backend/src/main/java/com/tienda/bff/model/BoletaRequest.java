package com.tienda.bff.model;

import java.util.List;

public class BoletaRequest {
    private List<ItemBoleta> items;

    public BoletaRequest() {}
    public BoletaRequest(List<ItemBoleta> items) { this.items = items; }

    public List<ItemBoleta> getItems() { return items; }
    public void setItems(List<ItemBoleta> items) { this.items = items; }
}
