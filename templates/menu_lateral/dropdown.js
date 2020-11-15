$('#conten-crearperfil').hide();
$('#btncrear').click(
    function () {
    if ($('#conten-crearperfil').hide()) {
        $('#conten-crearperfil').show("fast");
    }
    if ($('#conten-crearperfil').show("fast")) {
        $('#conten-crearperfil').hide();
    }
})
$('#btncerrar').click(
    function () {
    $('#conten-crearperfil').hide();
})
    



