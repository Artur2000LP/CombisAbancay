$(function() {
    $(".btn").click(function() {
        $(".form-signin").toggleClass("form-signin-left");
        $(".form-signup").toggleClass("form-signup-left");
        $(".frame").toggleClass("frame-long");
        $(".signup-active").toggleClass("signup-inactive");
        $(".signin-active").toggleClass("signin-inactive");
        $(".forgot").toggleClass("forgot-left");
        $(this).removeClass("idle").addClass("active");
    });

    $(".btn-signup").click(function() {
        $(".nav").toggleClass("nav-up");
        $(".form-signup-left").toggleClass("form-signup-down");
        $(".success").toggleClass("success-left");
        $(".frame").toggleClass("frame-short");
    });


});

$(document).ready(function () {
    $("#btn_usuario").click(function () {
        // Oculta el contenedor del login
        $("#loginContainer").hide();

        // Carga el contenido de vistaUsuario.html
        $.ajax({
            url: "vistaUsuario.html",
            success: function (result) {
                $("#vistaUsuario").html(result);
                $("#vistaUsuario").show();
            }
        });
    });
   
});


$(document).ready(function(){
    // Adjuntar un controlador de eventos al enlace para cargar recuperar_contraseña.html
    $('#btn_Reduperar').click(function(e) {
        e.preventDefault(); // Evitar el comportamiento predeterminado del enlace

        // Utilizando AJAX para cargar recuperar_contraseña.html
        $.ajax({
            url: 'html/recuperar_contrasena.html',
            type: 'GET',
            dataType: 'html',
            success: function(response) {
                // Insertando el contenido cargado en el div
                $('#recuperar_clave').html(response);
                // Mostrar el div una vez se complete la carga
                $('#recuperar_clave').show();
                // Ocultar el contenedor del formulario
                $('#loginContainer').hide();
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar recuperar_contraseña.html');
            }
        });
    });
    
});

/* login  */

 // Función para obtener el parámetro GET de la URL
 function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Función para mostrar el mensaje de error y ocultarlo después de 5 segundos
window.onload = function() {
    var error = getParameterByName('error');
    if (error) {
        document.getElementById("mensajeError").innerText = error;
        document.getElementById("mensajeError").style.display = "block";

        // Ocultar el mensaje después de 5 segundos
        setTimeout(function() {
            document.getElementById("mensajeError").style.display = "none";
        }, 5000); // 5000 milisegundos = 5 segundos
    } else {
        // Si no hay error en la URL, ocultar el mensaje de error
        document.getElementById("mensajeError").style.display = "none";
    }
};