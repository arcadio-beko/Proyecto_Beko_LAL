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
                sql = 'DELETE FROM clientes WHERE rowid=?';
                window.query(sql, [codi]).then(function (result) {
                    fila.remove();
                    console.log('Eliminado correctamente');
                    toastr.info('Cliente Eliminado')
                }, function (error) {
                    console.log('Error eliminando...', error);
                })}
        });


        sql = 'SELECT *, rowid FROM clientes';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];
                $('table tbody').append(
                    "<tr id='fila-"+ u['rowid'] + "'data-id='" + u['rowid'] + "' >\
                        <th>"+ u['rowid'] + "</th>\
                        <td class='td-nombre'>"+ u['nombres'] + "</td>\
                        <td class='td-apellido'>"+ u['apellidos'] + "</td>\
                        <td class='td-sexo'>"+ u['sexo'] + "</td>\
                        <td class='td-documento'>"+ u['documento'] + "</td>\
                        <td class='td-acudiente'>"+ u['acudiente'] + "</td>\
                        <td class='td-telefono  '>"+ u['telefono'] + "</td>\
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
                );}
        }, function (error) {
            console.log('Dato ingresado', error);
        })

        var fila_editantdo = null;
        $('table').on('click','.editar',function () {
            var tr = $(this).closest('tr');
            fila_editantdo = tr;
            const id= tr.data('id');
            const nombres = tr.find('.td-nombre').text();
            const apellidos = tr.find('.td-apellido').text();
            const sexo = tr.find('.td-sexo').text();
            const documento = tr.find('.td-documento').text();
            const acudiente = tr.find('.td-acudiente').text();
            const telefono = tr.find('.td-telefono').text();
            $('#inputnombreEdit').val(nombres);
            $('#inputapellidoEdit').val(apellidos);
            $('#inputsexoEdit').val(sexo);
            $('#inputdocumentoEdit').val(documento);
            $('#inputacudienteEdit').val(acudiente);
            $('#inputtelefonoEdit').val(telefono);
            $('#conten-editar').show('fast');
            $('#conten-crear').hide();
        })
        
        $('#formEditar').submit(function () {
            a = $('#inputnombreEdit').val();
            b = $('#inputapellidoEdit').val();
            c = $('#inputsexoEdit').val();
            d = $('#inputdocumentoEdit').val();
            e = $('#inputacudienteEdit').val();
            f = $('#inputtelefonoEdit').val();
            sql = 'UPDATE clientes SET nombres=?,apellidos=?,sexo=?,documento=?,acudiente=?,telefono=? WHERE rowid=? ';
            window.query(sql, [a, b, c, d,e,f,fila_editantdo.data('id')]).then(function (result) {
                toastr.info('Cliente Actualizado')
                fila_editantdo.find('.td-nombres').text(a);
                fila_editantdo.find('.td-apellidos').text(b);
                fila_editantdo.find('.td-sexo').text(c);
                fila_editantdo.find('.td-documento').text(d);
                fila_editantdo.find('.td-acudiente').text(e);
                fila_editantdo.find('.td-telefono').text(f);
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
            d = $('#inputdocumento').val();
            e = $('#inputacudiente').val();
            f = $('#inputtelefono').val();

            sql = 'INSERT INTO clientes(nombres,apellidos,sexo,documento,acudiente,telefono)VALUES(?,?,?,?,?,?)';
            window.query(sql, [a, b, c, d,e,f]).then(function (result) {
                toastr.success('Cliente Creado')
                console.log('Dato ingresado', result);
                $('table tbody').append(
                    "<tr id='fila-" + result.insertId + "'data-id='" + result.insertId + "'>\
                        <th>"+ result.insertId + "</th>\
                        <td class='td-nombre'>"+ a + "</td>\
                        <td class='td-apellido'>"+ b + "</td>\
                        <td class='td-sexo'>"+ c + "</td>\
                        <td class='td-documento'>"+ d + "</td>\
                        <td class='td-acudiente'>"+ e + "</td>\
                        <td class='td-telefono'>"+ f + "</td>\
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