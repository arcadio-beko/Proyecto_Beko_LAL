window.crearBaseDatos();
$(document).ready(function () {
$('#tablaproductos').hide();
$('#precio_total').hide();



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

      //Llamamos a productos

      sql = "SELECT rowid, * FROM productos"
      window.query(sql).then(function (result) {
          for (let i = 0; i < result.length; i++) {
              const prod = result[i];
              const prodString = JSON.stringify(prod)
              $("#selectProductos").append(
              `<option data-producto='` + prodString + `' value=${prod.rowid}> 
              
              <table class="table">
                <thead >
                <tr>
                  <th scope="col">${prod.nombre}</th>
                  <th scope="col">$${prod.precio}</th>
                </tr>
                </thead>
              </table>
              </option>`
              );
          };
      });

      $('#listaProductosSeleccionados').on('change','input', function () {

        const idPro = parseInt($(this).attr('id').substring(9,10));

        for (let i = 0; i < productosSeleccionados.length; i++) {
          const pro = productosSeleccionados[i].producto;

          if (idPro == pro.rowid) {

            pro.cantidad = $(this).val();
            pro.precio_total_prod = pro.precio * pro.cantidad;
            
            llenarListaProducto();
            return
          }
        }
      })

      function llenarListaProducto() {

        n = $('#nombre_cliente').val();
        var cliente = n.split(" ", 2);
        
        nombre_cli = cliente[0];
        apellido_cli = cliente[1];


        sql = 'SELECT rowid, *  FROM clientes WHERE nombres=? and apellidos=?';
        window.query(sql, [nombre_cli, apellido_cli]).then(function (result) {

        nom = result[0].nombres;
        ape = result[0].apellidos;


        $('#exampleModal .titulo').html(nom + " " + ape)
          
        
      }, function (error) {
        console.log('Dato ingresado', error);
    })

        


        const f = new Date().toLocaleString();
        $('#fecha').html(f)

        var totalpagar = 0;

        $('#listaProductosSeleccionados').html('')
        for (let i = 0; i < productosSeleccionados.length; i++) {
          const product = productosSeleccionados[i].producto;
          totalpagar = totalpagar + product.precio_total_prod;

          $('#tablaproductos').show('fast');
          $('#precio_total').show('fast');

          $('#listaProductosSeleccionados').append(
            `
            <tr>
              <td> ${product.nombre}</td>
              <td> ${product.precio}</td>
              <td> <input type="number" min="1" id="cantidad-${product.rowid}" value="${product.cantidad}"></td>
              <td> ${product.precio_total_prod}</td>
              <td>\
              <div class='btn-group'>\
                  <a data-codigo="${product.rowid}" id="borrar_producto" class='btn btn-sm'>\
                  <i class='fa fa-trash-alt'></i>\
                  </a>\
              </div>\
              </td>\
            </tr>
            `
          )
          $('#total').html('$ '+totalpagar)
        }


        $('#listaProductosSeleccionados2').html('')
        for (let i = 0; i < productosSeleccionados.length; i++) {
          const product = productosSeleccionados[i].producto;

          $('#tablaproductos').show('fast');
          $('#precio_total').show('fast');

          $('#listaProductosSeleccionados3').on('change','#efectivo', function () {
              cambio =   $('#efectivo').val();
              const cambio_total = cambio - totalpagar;
              $('#total_cambio').val(cambio_total)
          })
          $('#listaProductosSeleccionados2').append(
            `
            <tr>
              <td> ${product.nombre}</td>
              <td> ${product.precio}</td>
              <td> ${product.cantidad}</td>
              <td> ${product.precio_total_prod}</td>
            
            </tr>
            `
          )

          $('#total2').val(totalpagar)
        }
      }

      var productosSeleccionados = [];
      

      $('#btn-agregar-prod').click(function () {

        


        const idp = parseInt($('#selectProductos option:selected').val());
        const prod = $('#selectProductos option:selected').data();
        prod.producto.cantidad = 1;
        prod.producto.precio_total_prod = prod.producto.precio;
        let encontrado = false;

        for (let i = 0; i < productosSeleccionados.length; i++) {
          const prod = productosSeleccionados[i].producto;
          
          if (prod.rowid == idp) {
            encontrado = true;
          }
        }

        if (!encontrado) {
          productosSeleccionados.push(prod);
          llenarListaProducto()
        }
      
      })

    
      $('#tablaproductos').on('click', '#borrar_producto',function () {
        const cod = $(this).data('codigo')

        let restante = [];

        for (let i = 0; i < productosSeleccionados.length; i++) {
          const prod = productosSeleccionados[i];

          if (prod.producto.rowid != cod) {
            restante.push(prod);
          }
          
        }

        productosSeleccionados = restante;
        llenarListaProducto()



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

      $('#formcrear').submit(function () {

        n = $('#nombre_cliente').val();
        var cliente = n.split(" ", 2);
        
        nombre_cli = cliente[0];
        apellido_cli = cliente[1];


        sql = 'SELECT rowid, *  FROM clientes WHERE nombres=? and apellidos=?';
        window.query(sql, [nombre_cli, apellido_cli]).then(function (result) {

        
          id_cliente = result[0].rowid;
          
        
        var USER = JSON.parse(localStorage.usuario);
        var id = USER.rowid;
        var nombre_user = USER.nombres;
        var apelldio_user = USER.apellidos;

        nom_ape = nombre_user + " " + apelldio_user;

          const f = new Date().toLocaleString();
          $('#fecha').html(f)
          efectivo =   $('#efectivo').val();

          total = $('#total2').val();

          cambio = $('#total_cambio').val();

      
          sql = 'INSERT INTO ventas(usuario_id,nombre_user,fecha,cliente_id,pago,total,cambio)VALUES(?,?,?,?,?,?,?)';
          window.query(sql, [id, nom_ape, f,id_cliente,efectivo,total,cambio]).then(function (result) {
            let codiventa = result.insertId;

            for (let i = 0; i < productosSeleccionados.length; i++) {
              const prod = productosSeleccionados[i].producto;

              precio_total_prod =  prod.cantidad * prod.precio;
              detalle_venta(prod.rowid, prod.nombre,prod.cantidad, precio_total_prod)
              
            }
            function detalle_venta(prodId,prodnom, prodCant, prodPrec) {
              console.log("hola")
              sql = 'INSERT INTO venta_detalle(venta_id,producto_id,producto_nombre,cantidad,precio)VALUES(?,?,?,?,?)';
              window.query(sql, [codiventa, prodId,prodnom,prodCant,prodPrec]).then(function (result) {

                console.log(result)
                productosSeleccionados = []
                $('#cambio').val('');
                $('#total_cambio').html('');

              }), function (error) {
                console.log('Dato ingresado', error);
            }
            }
          })
            $('#tablaproductos').hide();
            $('#precio_total').hide();

            $('#exampleModal').modal('hide');

              toastr.success('Venta Creado')

          }, function (error) {
              console.log('Dato ingresado', error);
          })

          event.preventDefault();
      
    })
})
})