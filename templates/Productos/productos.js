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
                sql = 'DELETE FROM productos WHERE rowid=?';
                window.query(sql, [codi]).then(function (result) {
                    fila.remove();
                    console.log('Eliminado correctamente');
                    toastr.info('Producto Eliminado')
                }, function (error) {
                    console.log('Error eliminando...', error);
                })}
        });

        sql = 'SELECT *, rowid FROM productos';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];
                $('table tbody').append(
                    "<tr id='fila-"+ u['rowid'] + "'data-id='" + u['rowid'] + "' >\
                        <th>"+ u['rowid'] + "</th>\
                        <td class='td-nombre'>"+ u['nombre'] + "</td>\
                        <td class='td-abreviatura'>"+ u['abreviatura'] + "</td>\
                        <td class='td-precio'>"+ u['precio'] + "</td>\
                        <td class='td-costo'>"+ u['costo'] + "</td>\
                        <td class='td-descripcion'>"+ u['descripcion'] + "</td>\
                        <td class='td-proveedor'>"+ u['proveedor'] + "</td>\
                        <td class='td-cell_proveedor'>"+ u['cell_proveedor'] + "</td>\
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
            const nombre = tr.find('.td-nombre').text();
            const abreviatura = tr.find('.td-abreviatura').text();
            const precio = tr.find('.td-precio').text();
            const costo = tr.find('.td-costo').text();
            const descripcion = tr.find('.td-descripcion').text();
            const proveedor = tr.find('.td-proveedor').text();
            const cell_proveedor = tr.find('.td-cell_proveedor').text();
            $('#inputnombreEdit').val(nombre);
            $('#inputabreviaturaEdit').val(abreviatura);
            $('#inputsprecioEdit').val(precio);
            $('#inputcostoEdit').val(costo);
            $('#inputdescripcionEdit').val(descripcion);
            $('#inputproveedorEdit').val(proveedor);
            $('#inputcell_proveedorEdit').val(cell_proveedor);
            $('#conten-editar').show('fast');
            $('#conten-crear').hide();
        })
        
        $('#formEditar').submit(function () {
            a = $('#inputnombreEdit').val();
            b = $('#inputabreviaturaEdit').val();
            c = $('#inputsprecioEdit').val();
            d = $('#inputcostoEdit').val();
            e = $('#inputdescripcionEdit').val();
            f = $('#inputproveedorEdit').val();
            g = $('#inputcell_proveedorEdit').val();
            sql = 'UPDATE productos SET nombre=?,abreviatura=?,precio=?,costo=?,descripcion=?,proveedor=?,cell_proveedor=? WHERE rowid=? ';
            window.query(sql, [a, b, c, d,e,f,g,fila_editantdo.data('id')]).then(function (result) {
                toastr.info('Producto Actualizado')
                fila_editantdo.find('.td-nombre').text(a);
                fila_editantdo.find('.td-abreviatura').text(b);
                fila_editantdo.find('.td-precio').text(c);
                fila_editantdo.find('.td-costo').text(d);
                fila_editantdo.find('.td-descripcion').text(e);
                fila_editantdo.find('.td-proveedor').text(f);
                fila_editantdo.find('.td-cell_proveedor').text(g);
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
            b = $('#inputabreviatura').val();
            c = $('#inputprecio').val();
            d = $('#inputcosto').val();
            e = $('#inputdescripcion').val();
            f = $('#inputproveedor').val();
            g = $('#inputcell_proveedor').val();
            sql = 'INSERT INTO productos(nombre,abreviatura,precio,costo,descripcion,proveedor,cell_proveedor)VALUES(?,?,?,?,?,?,?)';
            window.query(sql, [a, b, c, d,e,f,g]).then(function (result) {
                toastr.success('Producto Creado')
                console.log('Dato ingresado', result);
                $('table tbody').append(
                    "<tr id='fila-" + result.insertId + "'data-id='" + result.insertId + "'>\
                        <th>"+ result.insertId + "</th>\
                        <td class='td-nombre'>"+ a + "</td>\
                        <td class='td-abreviatura'>"+ b + "</td>\
                        <td class='td-precio'>"+ c + "</td>\
                        <td class='td-costo'>"+ d + "</td>\
                        <td class='td-descripcion'>"+ e + "</td>\
                        <td class='td-proveedor'>"+ f + "</td>\
                        <td class='td-cell_proveedor'>"+ g + "</td>\
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