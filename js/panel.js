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
                        <th>"+ u['rowid'] + "</th>\
                        <td class='td-nombre'>"+ u['nombres'] + "</td>\
                        <td class='td-apellido'>"+ u['apellidos'] + "</td>\
                        <td class='td-sexo'>"+ u['sexo'] + "</td>\
                        <td class='td-documento'>"+ u['documento'] + "</td>\
                        <td class='td-tipo'>"+ u['tipo'] + "</td>\
                        <td class='td-usuario'>"+ u['usuario'] + "</td>\
                        <td>\
                            <div class='btn-group'>\
                                <a href='#'  class='btn btn-info btn-sm editar'>\
                                    <i class='fa fa-pen'></i>\
                                </a>\
                                <a href='#' class='btn btn-danger btn-sm eliminar'>\
                                    <i class='fas fa-user-minus'></i>\
                                </a>\
                            </div>\
                        </td>\
                    <tr>"
                );

            }
        }, function (error) {
            console.log('Dato ingresado', error);
        })

       
        
        
       
       

    })