package com.casino.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class JuegoNormalController {

    @GetMapping("/tragaperrasNormal")
    public String mostrarTragaperrasNormal() {
        // Asegúrate de que exista la plantilla: src/main/resources/templates/juegos/tragaperrasNormal.html
        return "juegos/tragaperrasNormal";
    }

    @GetMapping("/DinoNormal")
    public String mostrarDinoNormal() {
        // Asegúrate de que exista la plantilla: src/main/resources/templates/juegos/dinoNormal.html
        return "juegos/DinoNormal";
    }
}
