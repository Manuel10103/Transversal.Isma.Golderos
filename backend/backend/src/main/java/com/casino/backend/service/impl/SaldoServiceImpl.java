package com.casino.backend.service.impl;

import com.casino.backend.entity.UsuarioEntity;
import com.casino.backend.repo.SaldoRepository;
import com.casino.backend.service.SaldoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.Optional;

@Service
public class SaldoServiceImpl implements SaldoService {

    @Autowired
    private SaldoRepository saldoRepository;

    @Override
    public BigDecimal obtenerSaldo(long idUsuario) {
        Optional<UsuarioEntity> optUsuario = saldoRepository.findById(idUsuario);
        if (optUsuario.isPresent()) {
            return optUsuario.get().getSaldo();
        } else {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
    }

    @Override
    public boolean actualizarSaldo(long idUsuario, BigDecimal monto, boolean esDeposito) {
        Optional<UsuarioEntity> optUsuario = saldoRepository.findById(idUsuario);
        if (optUsuario.isPresent()) {
            UsuarioEntity usuario = optUsuario.get();
            BigDecimal saldoActual = usuario.getSaldo();
            BigDecimal nuevoSaldo = esDeposito ? saldoActual.add(monto) : saldoActual.subtract(monto);
            if (nuevoSaldo.compareTo(BigDecimal.ZERO) < 0) {
                return false; // Saldo insuficiente
            }
            usuario.setSaldo(nuevoSaldo);
            saldoRepository.save(usuario);
            return true;
        } else {
            return false;
        }
    }
}
