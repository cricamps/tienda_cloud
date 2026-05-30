package com.tienda.bff.model;

import java.time.LocalDateTime;
import java.util.List;

public class Boleta {
    private String numeroBoleta;
    private String cliente;
    private LocalDateTime fecha;
    private List<ItemBoleta> items;
    private Double subtotal;
    private Double iva;
    private Double total;

    public Boleta() {}

    public Boleta(String numeroBoleta, String cliente, LocalDateTime fecha,
                  List<ItemBoleta> items, Double subtotal, Double iva, Double total) {
        this.numeroBoleta = numeroBoleta;
        this.cliente = cliente;
        this.fecha = fecha;
        this.items = items;
        this.subtotal = subtotal;
        this.iva = iva;
        this.total = total;
    }

    public String getNumeroBoleta() { return numeroBoleta; }
    public void setNumeroBoleta(String numeroBoleta) { this.numeroBoleta = numeroBoleta; }

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public List<ItemBoleta> getItems() { return items; }
    public void setItems(List<ItemBoleta> items) { this.items = items; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getIva() { return iva; }
    public void setIva(Double iva) { this.iva = iva; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
}
