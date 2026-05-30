package com.tienda.bff.controller;

import com.tienda.bff.model.Boleta;
import com.tienda.bff.model.BoletaRequest;
import com.tienda.bff.model.ItemBoleta;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/boleta")
public class BoletaController {

    @PostMapping("/generar")
    public Boleta generarBoleta(
            @RequestBody BoletaRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        // Nombre del cliente desde el JWT de Azure B2C
        String nombreCliente = "Cliente";
        if (jwt != null) {
            String name = jwt.getClaimAsString("name");
            String email = jwt.getClaimAsString("emails");
            String sub = jwt.getSubject();
            nombreCliente = (name != null && !name.isBlank()) ? name
                          : (email != null && !email.isBlank()) ? email
                          : (sub != null ? sub : "Cliente");
        }

        List<ItemBoleta> items = request.getItems();
        if (items == null || items.isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        double subtotal = items.stream()
                .mapToDouble(item -> {
                    double precio = item.getPrecio() != null ? item.getPrecio() : 0.0;
                    int cantidad = item.getCantidad() != null ? item.getCantidad() : 0;
                    return precio * cantidad;
                })
                .sum();

        double iva   = Math.round(subtotal * 0.19 * 100.0) / 100.0;
        double total = Math.round((subtotal + iva) * 100.0) / 100.0;

        String numeroBoleta = "BOL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        return new Boleta(numeroBoleta, nombreCliente, LocalDateTime.now(), items, subtotal, iva, total);
    }
}
