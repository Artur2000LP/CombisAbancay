<?php
// Verifica si se enviaron datos
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica si se enviaron todos los datos necesarios
    if (isset($_POST["usuario"]) && isset($_POST["email"]) && isset($_POST["clave"]) && isset($_POST["confirmarclave"])) {
        // Verifica si las contraseñas coinciden
        if ($_POST["clave"] === $_POST["confirmarclave"]) {
            // Conectarse a la base de datos
            require_once "conexion.php";

            // Escapar las variables para evitar inyección SQL
            $usuario = $conexion->real_escape_string($_POST["usuario"]);
            $clave = $conexion->real_escape_string($_POST["clave"]);
            $email = $conexion->real_escape_string($_POST["email"]);

            // Consulta para insertar el nuevo usuario en la base de datos
            $query = "INSERT INTO loginadmin (usuario, clave, email) VALUES ('$usuario', '$clave' , '$email')";
            if ($conexion->query($query) === TRUE) {
                // echo "<script>alert('¡Usuario registrado exitosamente!');</script>";
                header("Location: ../index.html");
            } else {
                // echo "<script>alert('Error al registrar usuario: " . $conexion->error . "');</script>";
                header("Location: ../index.html");
            }

            // Cerrar la conexión
            $conexion->close();
        } else {
            header("Location: ../index.html?error=Las contraseñas no coinciden");
            // echo "<script>alert('Las contraseñas no coinciden');</script>";
            exit();
        }
    } else {
        // echo "<script>alert('Por favor, complete todos los campos');</script>";
    }
}
?>
