


<?php
$conexion = new mysqli("localhost", "root", "", "bdcombi");

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

?> 