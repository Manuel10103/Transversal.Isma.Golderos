<?php
session_start();
include("conexion.php");

if (!isset($_SESSION["id_usuario"])) {
    echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
    exit();
}

$id_usuario = $_SESSION["id_usuario"];
$id_juego = $_POST["id_juego"];
$monto = $_POST["monto"];
$resultado = $_POST["resultado"];
$ganancia = $_POST["ganancia"];
$tiempo_jugado = $_POST["tiempo_jugado"];

// Verificar si el usuario tiene saldo suficiente
$sql_check = "SELECT saldo FROM usuario WHERE id_usuario = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("i", $id_usuario);
$stmt_check->execute();
$stmt_check->bind_result($saldo_actual);
$stmt_check->fetch();
$stmt_check->close();

if ($saldo_actual < $monto) {
    echo json_encode(["status" => "error", "message" => "Saldo insuficiente"]);
    exit();
}

// Registrar la apuesta
$sql = "INSERT INTO apuesta (id_usuario, id_juego, monto, resultado, ganancia, tiempo_jugado) 
        VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iidssi", $id_usuario, $id_juego, $monto, $resultado, $ganancia, $tiempo_jugado);

if ($stmt->execute()) {
    // Actualizar saldo del usuario
    $nuevo_saldo = $saldo_actual + $ganancia - $monto;
    $sql_update = "UPDATE usuario SET saldo = ? WHERE id_usuario = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("di", $nuevo_saldo, $id_usuario);
    $stmt_update->execute();
    $stmt_update->close();

    echo json_encode(["status" => "success", "message" => "Apuesta registrada", "nuevo_saldo" => $nuevo_saldo]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al registrar apuesta"]);
}

$stmt->close();
$conn->close();
?>
