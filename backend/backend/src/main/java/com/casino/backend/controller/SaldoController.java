package com.casino.backend.controller;

import com.casino.backend.entity.UsuarioEntity;
import com.casino.backend.service.SaldoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;

@Controller
@RequestMapping("/saldo")
public class SaldoController {

    @Autowired
    private SaldoService saldoService;

    
    /*Muestra la vista con el saldo actual del usuario */
    @GetMapping("/mostrar")
    public String mostrarSaldo(HttpSession session, Model model) {
        Object usuarioObj = session.getAttribute("usuario");
        if (usuarioObj == null) {
            return "redirect:/usuarios/login";
        }
        UsuarioEntity usuario = (UsuarioEntity) usuarioObj;
        BigDecimal saldo = saldoService.obtenerSaldo(usuario.getIdUsuario());
        model.addAttribute("saldo", saldo);
        return "saldo/mostrar"; 
    }

    /*para actualizar el saldo.
      Se espera recibir los parámetros idUsuario, monto y esDeposito */
     
    @PostMapping("/actualizar")
    public ResponseEntity<?> actualizarSaldo(@RequestParam Integer idUsuario,
                                               @RequestParam BigDecimal monto,
                                               @RequestParam boolean esDeposito) {
        boolean exito = saldoService.actualizarSaldo(idUsuario, monto, esDeposito);
        if (exito) {
            return ResponseEntity.ok(Collections.singletonMap("mensaje", "Saldo actualizado correctamente"));
        } else {
            return ResponseEntity.badRequest().body("Error: Saldo insuficiente o usuario no encontrado");
        }
    }
}
