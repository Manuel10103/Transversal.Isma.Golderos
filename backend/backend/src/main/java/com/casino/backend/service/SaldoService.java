package com.casino.backend.service;

import java.math.BigDecimal;

public interface SaldoService {

    
    BigDecimal obtenerSaldo(long idUsuario);
    boolean actualizarSaldo(long idUsuario, BigDecimal monto, boolean esDeposito);
}
