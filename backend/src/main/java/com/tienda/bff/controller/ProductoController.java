package com.tienda.bff.controller;

import com.tienda.bff.model.Producto;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @GetMapping
    public List<Producto> getProductos(@AuthenticationPrincipal Jwt jwt) {
        return List.of(
            new Producto(1L,  "Arroz",   "Arroz grano largo 1kg",     1290.0, "Granos",    "granos",    50, "Arroz de primera calidad, ideal para todo tipo de preparaciones. Grano largo de cocción perfecta y sabor neutro."),
            new Producto(2L,  "Aceite",  "Aceite vegetal 1L",         2490.0, "Aceites",   "aceite",    30, "Aceite vegetal 100% puro, sin colesterol. Ideal para frituras y aderezos. Botella de 1 litro."),
            new Producto(3L,  "Azúcar",  "Azúcar blanca 1kg",         1190.0, "Granos",    "azucar",    40, "Azúcar blanca refinada de primera calidad para repostería y bebidas. Bolsa de 1 kilogramo."),
            new Producto(4L,  "Leche",   "Leche entera 1L",           1090.0, "Lácteos",   "leche",     25, "Leche entera pasteurizada, rica en calcio y vitaminas esenciales. Presentación de 1 litro."),
            new Producto(5L,  "Pan",     "Pan de molde 500g",         1590.0, "Panadería", "pan",       20, "Pan de molde suave y esponjoso, perfecto para sándwiches y tostadas. Bolsa de 500 gramos."),
            new Producto(6L,  "Huevos",  "Huevos blancos x12",        2990.0, "Lácteos",   "huevos",    35, "Huevos frescos de gallina, calibre mediano. Ideales para cualquier receta. Bandeja de 12 unidades."),
            new Producto(7L,  "Fideos",  "Fideos spaghetti 400g",      890.0, "Granos",    "fideos",    60, "Fideos tipo spaghetti de semolina de trigo duro. Cocción al dente en 8 minutos. Paquete de 400 gramos."),
            new Producto(8L,  "Tomate",  "Tomate en lata 400g",        790.0, "Conservas", "conserva",  45, "Tomates pelados enteros en su jugo. Ideales para salsas y guisos caseros. Lata de 400 gramos."),
            new Producto(9L,  "Atún",    "Atún en agua 170g",         1390.0, "Conservas", "conserva",  55, "Atún light en agua, bajo en grasas y rico en proteínas. Sin conservantes añadidos. Lata de 170 gramos."),
            new Producto(10L, "Harina",  "Harina sin polvos 1kg",      990.0, "Granos",    "granos",    40, "Harina de trigo sin polvos de hornear. Apta para pan, pasteles y repostería en general. Bolsa de 1 kg.")
        );
    }
}
