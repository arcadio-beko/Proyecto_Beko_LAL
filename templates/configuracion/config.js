window.crearBaseDatos();
$(document).ready(
    function () {
        //Traemos el usuario que esta en LocalStorage
        var USER = JSON.parse(localStorage.usuario);
        $(function () {
        //Guardamos los datos de LocalStorage en constantes
            const nombre = USER.nombres;
            const apellido = USER.apellidos;
            const sexo = USER.sexo;
            const tipo = USER.tipo;
            const documento = USER.documento;
            const usuario = USER.usuario;
            const password = USER.password;
        //Enviamos los datos del usuario a un id 
            $('#inputnombreEdit').val(nombre);
            $('#inputapellidoEdit').val(apellido);
            $('#inputsexoEdit').val(sexo);
            $('#inputtipoEdit').val(tipo);
            $('#inputdocumentoEdit').val(documento);
            $('#inputusuarioEdit').val(usuario);
            $('#inputpasswordEdit').val(password);
        })
        
        $('#formEditar').submit(function () {
        //Guardamos el id del usuario para saber cual se va a editar
            const id= USER.rowid;
            a = $('#inputnombreEdit').val();
            b = $('#inputapellidoEdit').val();
            c = $('#inputsexoEdit').val();
            d = $('#inputtipoEdit').val();
            e = $('#inputdocumentoEdit').val();
            f = $('#inputusuarioEdit').val();
            g = $('#inputpasswordEdit').val();
        //Traemos los valores de los input de password para verficar que coincidad
            const pass1 = $('#inputpasswordEdit').val();
            const pass2 = $('#inputpasswordEdit2').val();

            if (pass1 == pass2) {
        //Si coinciden las contraseñas, editamos el usuario
                sql = 'UPDATE users SET nombres=?,apellidos=?,sexo=?,tipo=?,documento=?,usuario=?, password=? WHERE rowid=? ';
                window.query(sql, [a, b, c, d,e,f,g, id]).then(function (result) {
        //Aqui volvemos a traer todos los usurios, para que me traiga el usuario que acabamos de actualizar para poder enviar los nuevos datos al LocalStorage y se actulize
                    sql = 'SELECT *, rowid FROM users WHERE rowid=?';
                    window.query(sql, [id]).then(function (result2) {
        //Enviamos los datos al LocalStorage del usuario que acabamos de actualizar 
                        const usuario = result2[0];
                         localStorage.setItem('usuario',JSON.stringify(usuario));
                        $('.nombre-usuario').html(USER.nombres);
                        var nombres = usuario.nombres
                        toastr.info(nombres + ' actualizado');
                    }, function (error) {
                        console.log('Error...', error);
                    })
                }, function (error) {
                    console.log('Dato ingresado', error);
                })
            }else{
                toastr.warning('Deben coincidir las contraseñas');
            }
            event.preventDefault();
        }) 
    })