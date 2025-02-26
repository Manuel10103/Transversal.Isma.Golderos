package com.casino.backend.entity;

public class JugadaDTO {
    private String usuario;
    private String resultado;
    private double monto;     // Monto apostado
    private double ganancia;  // Ganancia neta (0 si perdió)
    private String fecha;

    public JugadaDTO() {
    }

    public JugadaDTO(String usuario, String resultado, double monto, double ganancia, String fecha) {
        this.usuario = usuario;
        this.resultado = resultado;
        this.monto = monto;
        this.ganancia = ganancia;
        this.fecha = fecha;
    }

    public String getUsuario() {
        return usuario;
    }
    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
    public String getResultado() {
        return resultado;
    }
    public void setResultado(String resultado) {
        this.resultado = resultado;
    }
    public double getMonto() {
        return monto;
    }
    public void setMonto(double monto) {
        this.monto = monto;
    }
    public double getGanancia() {
        return ganancia;
    }
    public void setGanancia(double ganancia) {
        this.ganancia = ganancia;
    }
    public String getFecha() {
        return fecha;
    }
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
}
