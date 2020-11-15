window.crearBaseDatos();
$(document).ready(function () {
  $('#detalle_cliente').hide();
 
  $('#clientes').hide();
  $('#ventas').hide();
  $('#ventas_detalles').hide();
  $('#productos').hide();



  $('#abrir_clientes').click(
    function () {
        $('#clientes').show('fast');
        $('#ventas').hide();
        $('#productos').hide();
      $('#ventas_detalles').hide();
    })

  $('#abrir_ventas').click(
      function () {
          $('#ventas').show('fast');
          $('#clientes').hide();
          $('#productos').hide();
          $('#ventas_detalles').hide();
      })
  
  $('#abrir_ventas_detalles').click(
    function () {
        $('#ventas_detalles').show('fast');
        $('#ventas').hide();
        $('#clientes').hide();
        $('#productos').hide();
    })

  $('#abrir_productos').click(
        function () {
            $('#productos').show('fast');
            $('#clientes').hide();
            $('#ventas').hide();
            $('#ventas_detalles').hide();
        })

//Clientes

sql = "SELECT * FROM clientes"
window.query(sql).then(function (result) {
  var substringMatcher = function (strs) {
      return function findMatches(q, cb) {
        var matches, substringRegex;
        matches = [];
        substrRegex = new RegExp(q, "i");
        $.each(strs, function (i, str) {
          if (
            substrRegex.test(str.nombres) ||
            substrRegex.test(str.apellidos)
          ) {
            matches.push(`${str.nombres} ${str.apellidos}`);
          }
        });

        cb(matches);
      };
    };

    $("#buscarNombre .typeahead").typeahead(
      {
        hint: true,
        highlight: true,
        minLength: 1,
      },
      {
        name: "nombres",
        source: substringMatcher(result),
      });
})

  sql = 'SELECT *, rowid FROM clientes';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];
                const cliString = JSON.stringify(u)

                $('#clientes_datos').append(
                  "<tr>\
                    <td >"+ u['nombres'] + "</td>\
                    <td >"+ u['apellidos'] + "</td>\
                    <td >"+ u['sexo'] + "</td>\
                    <td >"+ u['documento'] +  "</td>\
                    <td >"+ u['acudiente'] + "</td>\
                    <td >"+ u['telefono'] + "</td>\
                  </tr>"
                );

                $('#clientes_select').append(
                  `<option class="option_cliente"  value=${u.rowid}>${u.nombres} ${u.apellidos}</option>`
                );
            }
        }, function (error) {
            console.log('Dato ingresado', error);
        })

  


        $('#buscarNombre').on('change','input', function () {

         $("#tablas_info").html('');

        })
    

  $('#btn-ventas_cliente').click(function () {

    $("#tablas_info").html('');

    n = $('#nombre_cliente').val();
    var cliente = n.split(" ", 2);
    
    nombre_cli = cliente[0];
    apellido_cli = cliente[1];


    sql = 'SELECT rowid, *  FROM clientes WHERE nombres=? and apellidos=?';
    window.query(sql, [nombre_cli, apellido_cli]).then(function (result) {
    idcli = result[0].rowid;
    
    sql = 'SELECT rowid, *  FROM clientes WHERE rowid=?';
    window.query(sql,[idcli]).then(function (result) {
      let clientes = result[0]   
    
      $('#detalle_cliente').show('fast');
      

      console.log(clientes.nombres)

    sql = 'SELECT rowid, * FROM ventas WHERE cliente_id=?';
    window.query(sql,[idcli]).then(function (result) {
      function traerdetalle(venta, venta_id) {
        let   sql = 'SELECT rowid, * FROM venta_detalle WHERE venta_id=?';
        window.query(sql,[venta_id]).then(function (result) {
          venta.detalle = result
          console.log(venta.detalle)
         })
      }

        for (let i = 0; i < result.length; i++) {
            const venta = result[i];
            traerdetalle(venta, venta.rowid)
        }

        

        setTimeout( () =>{
          for (let i = 0; i < result.length; i++) {
            const ventas = result[i];
            $('#tablas_info').append(
              `
              <br>
             

              <div id="container" style="border: solid 2px #f4846f;">
                    <section id="invoice-title-number">
                    
                      <span id="title">Venta#</span>
                      <span id="number">${ventas.rowid}</span>
                      
                    </section>
                    
                    <div class="clearfix"></div>
                    
                    <section id="client-info" class="clientes_info${ventas.rowid}">
                     
                    </section>
      
            <div class="clearfix"></div>
                
                <section id="items">
                  
                  <table cellpadding="0" cellspacing="0">
                  
                    <tr>
                      <th></th> 
                      <th style="width: 126px;">USUARIO</th> 
                      <th>PRODUCTOS</th>
                      <th>CANTIDAD</th>
                      <th>PRECIO</th>
                      <th>FECHA</th>
                    </tr>
                    
                    <tbody id="detalle_producto-${ventas.rowid}">
                       
                       

                    </tbody>
                   
                    
                  </table>
                  
                </section>
      
                <section id="sums">
                
                  <table cellpadding="0" cellspacing="0" id="cuentas-${ventas.rowid}">
                    
                    
                  </table>

                  <div class="clearfix"></div>
                  
                </section>
      
                <div class="clearfix"></div>

                


                  <br />

                
                </section>

                <div class="clearfix"></div>

                <div class="thank-you">GRACIAS</div>

                <div class="clearfix"></div>
              </div>
            `
            );


            $('#cuentas-' + ventas.rowid).append(
              `
              <tr data-hide-on-quote="true">
                <th>EFECTIVO</th>
                <td>${ventas.pago}</td>
              </tr>

            <tr class="amount-total">
              <th>CAMBIO</th>
              <td>${ventas.cambio}</td>
            </tr>
            
            <tr data-hide-on-quote="true">
              <th>TOTAL</th>
              <td>${ventas.total}</td>
            </tr>
             
              `
            );

            $('.clientes_info'+ ventas.rowid).append(
              `
              <span>CLIENTE:</span>
              <div>
                <span class="bold"> ${clientes.nombres + " " + clientes.apellidos}</span>
              </div>
              
              <div>
                <span>${clientes.documento}</span>
              </div>
              
              <div>
                <span>${clientes.acudiente}</span>
              </div>
              
              <div>
                <span>${clientes.telefono}</span>
              </div>
              `
            );

           
            


            for (let j = 0; j < ventas.detalle.length; j++) {
              const detalle = ventas.detalle[j];
              
              

              $('#detalle_producto-' + ventas.rowid).append(
                `

                <tr data-iterate="item">
                <td></td> 
                <td>${ventas.nombre_user}</td> 
                <td>${detalle.producto_nombre} </td>
                <td>${detalle.cantidad}</td>
                <td>${detalle.precio}</td>
                <td>${ventas.fecha}</td> 
                </tr>
               
                `
              );


              
            }

            
            
          }
          
        },100)
        
      })
    }, function (error) {
        console.log('Dato ingresado', error);
    })
    
  }, function (error) {
    console.log('Dato ingresado', error);
}
)

    

    
  
  })

//ventas
        sql = 'SELECT *, rowid FROM ventas';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];
                $('#ventas_datos').append(
                  "<tr>\
                    <td >"+ u['usuario_id'] + "</td>\
                    <td >"+ u['nombre_user'] + "</td>\
                    <td >"+ u['fecha'] + "</td>\
                    <td >"+ u['cliente_id'] +  "</td>\
                    <td >"+ u['descripcion'] + "</td>\
                    <td >"+ u['pago'] + "</td>\
                  </tr>"
                );
            }
        }, function (error) {
            console.log('Dato ingresado', error);
        })

//ventas detalles
  sql = 'SELECT *, rowid FROM venta_detalle';
  window.query(sql).then(function (result) {
      var items = result;
      for (let i = 0; i < items.length; i++) {
          const u = items[i];
          $('#venta_detalle_datos').append(
            "<tr>\
              <td >"+ u['venta_id'] + "</td>\
              <td >"+ u['producto_id'] + "</td>\
              <td >"+ u['producto_nombre'] + "</td>\
              <td >"+ u['cantidad'] +  "</td>\
              <td >"+ u['precio'] + "</td>\
            </tr>"
          );
      }
  }, function (error) {
      console.log('Dato ingresado', error);
  })

//productos
  sql = 'SELECT *, rowid FROM productos';
  window.query(sql).then(function (result) {
      var items = result;
      for (let i = 0; i < items.length; i++) {
          const u = items[i];
          $('#productos_datos').append(
            "<tr>\
              <td >"+ u['nombre'] + "</td>\
              <td >"+ u['abreviatura'] + "</td>\
              <td >"+ u['precio'] + "</td>\
              <td >"+ u['costo'] +  "</td>\
              <td >"+ u['descripcion'] + "</td>\
              <td >"+ u['proveedor'] + "</td>\
              <td >"+ u['cell_proveedor'] + "</td>\
            </tr>"
          );
      }
  }, function (error) {
      console.log('Dato ingresado', error);
  })

  
})