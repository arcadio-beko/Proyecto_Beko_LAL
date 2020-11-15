window.crearBaseDatos();
$(document).ready(
    function () {
        $('#conten-crear').hide();
        $('#conten-editar').hide();
        $('table').on('click', '.eliminar', function () {
            const resp = confirm('¿Esta seguro que quiere elimnarlo?')
            if (resp) {
                const fila = $(this).closest('tr');
                const codi = fila.data('id');
                sql = 'DELETE FROM users WHERE rowid=?';
                window.query(sql, [codi]).then(function (result) {
                    fila.remove();
                    console.log('Eliminado correctamente');
                    toastr.info('Usuario Eliminado')
                }, function (error) {
                    console.log('Error eliminando...', error);
                })
            }
        });

        
        sql = 'SELECT *, rowid FROM users';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];
                $('table tbody').append(
                    "<tr id='fila-"+ u['rowid'] + "'data-id='" + u['rowid'] + "' >\
                    <th >"+ u['rowid'] + "</th>\
                    <td class='td-nombre'>"+ u['nombres'] + "</td>\
                    <td class='td-apellido'>"+ u['apellidos'] + "</td>\
                    <td class='td-sexo'>"+ u['sexo'] + "</td>\
                    <td class='td-tipo'>"+ u['tipo'] +  "</td>\
                    <td class='td-documento'>"+ u['documento'] + "</td>\
                    <td class='td-usuario'>"+ u['usuario'] + "</td>\
                    <td>\
                        <div class='btn-group'>\
                            <a href='#' class='btn btn-danger btn-sm eliminar'>\
                                 <i class='fas fa-user-times'></i>\
                            </a>\
                            <a href='#'  class='btn btn-info btn-sm editar'>\
                                <i class='fas fa-user-edit'></i>\
                            </a>\
                        </div>\
                    </td>\
                <tr></tr>"
                );
            }
        }, function (error) {
            console.log('Dato ingresado', error);
        })

        var fila_editantdo = null;
        $('table').on('click','.editar',function () {
            var tr = $(this).closest('tr');
            fila_editantdo = tr;
            const id= tr.data('id');
            const nombre = tr.find('.td-nombre').text();
            const apellido = tr.find('.td-apellido').text();
            const sexo = tr.find('.td-sexo').text();
            const tipo = tr.find('.td-tipo').text();
            const documento = tr.find('.td-documento').text();
            const usuario = tr.find('.td-usuario').text();
            $('#inputnombreEdit').val(nombre);
            $('#inputapellidoEdit').val(apellido);
            $('#inputsexoEdit').val(sexo);
            $('#inputtipoEdit').val(tipo);
            $('#inputdocumentoEdit').val(documento);
            $('#inputusuarioEdit').val(usuario);
            $('#conten-editar').show('fast');
            $('#conten-crear').hide();

        })
        
        $('#formEditar').submit(function () {
            a = $('#inputnombreEdit').val();
            b = $('#inputapellidoEdit').val();
            c = $('#inputsexoEdit').val();
            d = $('#inputtipoEdit').val();
            e = $('#inputdocumentoEdit').val();
            f = $('#inputusuarioEdit').val();
            sql = 'UPDATE users SET nombres=?,apellidos=?,sexo=?,tipo=?,documento=?,usuario=? WHERE rowid=? ';
            window.query(sql, [a, b, c, d,e,f,fila_editantdo.data('id')]).then(function (result) {
                toastr.info('Usuario Actualizado')
                fila_editantdo.find('.td-nombre').text(a);
                fila_editantdo.find('.td-apellido').text(b);
                fila_editantdo.find('.td-sexo').text(c);
                fila_editantdo.find('.td-tipo').text(d);
                fila_editantdo.find('.td-documento').text(e);
                fila_editantdo.find('.td-usuario').text(f);
                $('#conten-editar').hide();
            }, function (error) {
                console.log('Dato ingresado', error);
            })
            event.preventDefault();
        }) 

        $('#btncancelEdit').click(
            function () {
                $('#conten-editar').hide();
                $('#conten-crear').hide();
            })

        $('#btncrear').click(
            function () {
                $('#conten-crear').show('fast');
                $('#conten-editar').hide();
            })

        $('#btncancel').click(
            function () {
               $('#conten-crear').hide();
            })
       
        $('#formcrear').submit(function () {
            a = $('#inputnombre').val();
            b = $('#inputapellido').val();
            c = $('#inputsexo').val();
            d = $('#inputtipo').val();
            e = $('#inputdocumento').val();
            f = $('#inputusuario').val();
            g = $('#inputpassword').val();
            sql = 'INSERT INTO users(nombres,apellidos,sexo,tipo,documento,usuario,password)VALUES(?,?,?,?,?,?,?)';
            window.query(sql, [a, b, c, d,e,f,g]).then(function (result) {
                toastr.success('Usuario Creado')
                console.log('Dato ingresado', result);
                $('table tbody').append(
                    "<tr id='fila-" + result.insertId + "'data-id='" + result.insertId + "'>\
                        <th >"+ result.insertId + "</th>\
                        <td class='td-nombre'>"+ a + "</td>\
                        <td class='td-apellido'>"+ b + "</td>\
                        <td class='td-sexo'>"+ c + "</td>\
                        <td class='td-tipo'>"+ d + "</td>\
                        <td class='td-documento'>"+ e + "</td>\
                        <td class='td-usuario'>"+ f + "</td>\
                        <td>\
                            <div class='btn-group'>\
                                <a href='#' class='btn btn-danger btn-sm eliminar'>\
                                    <i class='fas fa-user-times'></i>\
                                </a>\
                                <a href='#'  class='btn btn-info btn-sm editar'>\
                                    <i class='fas fa-user-edit'></i>\
                                </a>\
                            </div>\
                        </td>\
                    <tr>"
                );
                $('#conten-crear').hide();
            }, function (error) {
                console.log('Dato ingresado', error);
            })
            event.preventDefault();
        })
    })