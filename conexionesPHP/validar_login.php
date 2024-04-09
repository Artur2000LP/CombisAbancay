<?php
require_once "conexion.php";
// Verifica si se enviaron datos
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica si se enviaron el usuario y la contraseña
    if (isset($_POST["usuario"]) && isset($_POST["clave"])) {

        $usuario = $conexion->real_escape_string($_POST["usuario"]);
        $clave = $conexion->real_escape_string($_POST["clave"]);

        // Consultar la base de datos para verificar las credenciales
        $query = "SELECT * FROM loginadmin WHERE usuario='$usuario' AND clave='$clave'";
        $resultado = $conexion->query($query);

        // Verificar si se encontraron registros
        if ($resultado->num_rows == 1) {
            // Iniciar sesión (si es necesario) y redirigir al usuario
            session_start();
            $_SESSION["usuario"] = $usuario;
            header("Location: https://parzibyte.github.io/horarios_rutas_transporte_publico/");
            exit();
        } else {
            // Si las credenciales son incorrectas, redirigir con mensaje de error
            header("Location: ../index.html?error=Usuario o contraseña incorrectos");
            exit();
        }

        // Cerrar la conexión
        $conexion->close();
    } else {
        // Si no se enviaron usuario y contraseña, redirigir con mensaje de error
        header("Location: ../index.html?error=Por favor, ingrese usuario y contraseña");
        exit();
    }
}
?>
