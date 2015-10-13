
/*funciones de conexion con el servidor*/
var ajx = 
{
    server: 'http://prosidapp.ddns.net',
    /*funcion_er: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        //alert('error al comunicarse con el servidor: '+error.text);
    },*/
    enviar_peticion: function(funcion_su, funcion_er, peticion, datos)
    {
        if (funcion_er == "") funcion_er = ajx.funcion_er;
        urll = ajx.server+peticion;
        $.ajax({
            type: 'POST',
            data: datos,
            url: urll,
            success:funcion_su
            //error:funcion_er
        }).fail( function( jqXHR, textStatus, errorThrown ) {
                if (jqXHR.status === 0) {
                        alert('Not connect: Verify Network.');
                } else if (jqXHR.status == 404) {
                        alert('Requested page not found [404]');
                } else if (jqXHR.status == 500) {
                        alert('Internal Server Error [500].');
                        //console.log("error: "+jqXHR.responseText)
                } else if (textStatus === 'parsererror') {
                        alert('Requested JSON parse failed.');
                } else if (textStatus === 'timeout') {
                        alert('Time out error.');
                } else if (textStatus === 'abort') {
                        alert('Ajax request aborted.');
                } else {
                        alert('Uncaught Error: ' + jqXHR.responseText);
                }

            });
    }
};

/*funciones de interfaz grafica*/
var app = 
{
    meses:[
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
    ],

    muestras: null,
    prd_act: 0,
    xmlDoc: null,
    
    // Application Constructor
    initialize: function() 
    {
        this.bindEvents();
    },

    bindEvents: function() 
    {
        // boton toma foto
        var bt_image = document.getElementById('bt_image');  
        bt_image.addEventListener('click', Imagen.take_image, false);
        // funcion lee codigo qr
        var bt_qr = document.getElementById('bt_qr'); 
        bt_qr.addEventListener('click', qr.leer_qr, false);

        var bt_analizar = document.getElementById('bt_analizar');  
        bt_analizar.addEventListener('click', Imagen.bt_analizar_foto, false);  
        //var home = document.getElementById('home');  
        //home.addEventListener('click', app.home, false); 
        //var logout = document.getElementById('boton_logout');  
        //logout.addEventListener('click', app.logout, false);  
        var bt_login = document.getElementById('boton_login');  
        bt_login.addEventListener('click', app.login, false);  
        
        var bt_add_std = document.getElementById('bt_add_std');  
        bt_add_std.addEventListener('click', app.bt_add_std, false);
        
        //var bt_save_step1 = document.getElementById('bt_save_step1');  
        //bt_save_step1.addEventListener('click', app.save_step1, false);  
        var filtro_cliente = document.getElementById('filtro_cliente');  
        filtro_cliente.addEventListener('change', app.bt_change_filtros, false);

        $( "#filtro_año" ).bind( "click", app.change_filtros);
        filtro_cliente.addEventListener('change', app.bt_change_filtros, false);  
        var filtro_cliente = document.getElementById('filtro_mes');  
        filtro_cliente.addEventListener('change', app.bt_change_filtros, false); 

        var select_muestra = document.getElementById('muestras');  
        select_muestra.addEventListener('change', app.change_select_muestra, false);  

        var bt_sgt_prd = document.getElementById('bt_sgt_prd');
        bt_sgt_prd.addEventListener('click',app.sgt_producto);
        //document.addEventListener('deviceready', this.onDeviceReady, false);
    },

/* llena tabla con los analisis que contiene data*/
    llenar_tabla_analisis: function(datos_analisis) 
    {
        $.mobile.changePage("#page_analisis");
        var tabla = document.getElementById('table_resultados');
        // Crear sección <tbody>
        var tbody = document.createElement('tbody');
        tabla.appendChild(tbody);
        for (var i = 0; i < datos_analisis.length; i++){
            var analisis = datos_analisis[i];
            // Añadir una fila a la sección <tbody>
            fila = document.createElement('tr');
            tbody.appendChild(fila);
            var celda = document.createElement('td');
            celda.innerHTML = analisis.p;
            fila.appendChild(celda);
            celda = document.createElement('td');
            celda.innerHTML = analisis.r;
            fila.appendChild(celda);
            celda = document.createElement('td');
            celda.innerHTML = 0;
            fila.appendChild(celda);
            celda = document.createElement('td');
            celda.innerHTML = 0;
            fila.appendChild(celda);
        }
        $('#table_resultados').table('refresh');          
    },

/*funcion que se ejecuta al filtrar muestras mediante los select(cliente, año, y mes)
procesa la informacion recibida del servidor y añade un lista de las muestras obtenidas en el filtrado
añade evento a cada item de las lista*/
    change_filtros: function(data)
    { 
        if (data_json.session_iniciada == "1") {
            app.muestras = data_json.muestras;
            //var select = document.getElementById("muestras");
            var lista = document.getElementById("muestras");
            lista.innerHTML = "";
            var item = "";
            var dir_img = "";
            for (var i=0; i<app.muestras.length; i++) {
                var m = app.muestras[i];
                var cliente = m.cliente;
                cliente =  cliente.toUpperCase();
                //if(cliente == "ASF-K DE MEXICO") dir_img ="img/asf-k.jpg";
                //if(cliente == "SIMEC INTERNACIONAL PLANTA MEXICALI") dir_img ="img/simec.jpg";
                //if(cliente == "ACINOX TUNAS") dir_img ="img/acinox.bmp";
                if(cliente.indexOf('ASF-K') != -1 ) dir_img ="img/asf-k.jpg";
                if(cliente.indexOf('SIMEC') != -1 ) dir_img ="img/simec.jpg";
                if(cliente.indexOf('ACINOX') !=-1 ) dir_img ="img/acinox.jpg";
                var no_analisis = m.no_analisis;
                var li = document.createElement('li');
                var f = "app.add_std("+no_analisis+");";
                li.setAttribute('onclick',f);
                lista.appendChild(li);
                var a = document.createElement('a');
                li.appendChild(a);
                var img = document.createElement('img');
                img.setAttribute('src', dir_img);
                a.appendChild(img);
                var h2 = document.createElement('h2');
                h2.innerHTML = cliente+"<br>N° analisis "+no_analisis+"<br>colada "+m.no_colada;
                a.appendChild(h2);
                var p = document.createElement('p');
                p.innerHTML = m.descripcion_reporte+"<br>"+m.descripcion_muestra;
                a.appendChild(p);
            }
            $('#muestras').listview('refresh');
        }
        //else{alert("nombre de usuario o contraseña incorrectos");}
    },

    bt_change_filtros: function()
    {
        var cliente = document.getElementById("filtro_cliente").value;
        var año = document.getElementById("filtro_año").value;        
        var mes = document.getElementById("filtro_mes").value;
        if(año == "no_select")return true;
        if(mes == "no_select") return true;             
        if(cliente == 'all') cliente = "";
        if(mes == "all") mes = "";
        var datos =
            {
                'operacion':'filtros',
                'f':'muestras',
                'cliente':cliente,
                'anio':año,
                'mes':mes
            };
        ajx.enviar_peticion(app.change_filtros, "", "/appmovil.php", datos);
    },
    
        
    login: function(data)
    {
        data_json = JSON.parse(data)
        if (data_json.validate == "1"){
            $.mobile.changePage("#page_home");
        }
        else {
            alert("nombre de usuario o contraseña incorrectos");
        }
    },

    bt_login: function()
    {
        var user = $('#user').val();
        var password = $('#password').val();
        datos = {
            'operacion':'login',
            'user':user,
            'password':password
        },
        ajx.enviar_peticion(app.login, "", "/appmovil.php", datos);
    },

    save_step1: function()
    {
        $.mobile.changePage("#page_save1");
    },

/* verifica si existe alguna session iniciada*/
    change_home: function(data)
    { 
        data_json = JSON.parse(data)
        if ( data_json.session_iniciada == "1"){
            $.mobile.changePage("#home");
        }
    },
    session_ini: function()
    {
        var data = {'operacion':'session_iniciada'};
        ajx.enviar_peticion(app.change_home, "", "/appmovil.php", datos);
    },

/*obtiene productos del servidor y los muestra*/
    sgt_producto: function()
    {
        var productos = app.xmlDoc.getElementsByTagName("producto");
        if (app.prd_act == productos.length)app.prd_act = 0; 
        name_prod = productos[app.prd_act].getElementsByTagName("name")[0].childNodes[0].nodeValue;
        descripcion = productos[app.prd_act].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        url = productos[app.prd_act].getElementsByTagName("url")[0].childNodes[0].nodeValue;
        html = "<h1>"+name_prod+"</h1><hr/>"; // nombre del producto
        html += "<p>"+descripcion; // descripcion del producto
        html += "<a onclick=\"window.open('"+url+"', "+"'_system', "+"'location=n0')\"> Consultar especificacion</a> </p>";
        app.prd_act+=1;
        var div_productos = document.getElementById("productos");
        div_productos.innerHTML = html;
    },

    ini_productos: function(data){
        app.xmlDoc = data; 
        app.sgt_producto();

    },

    get_productos:function()
    {
        var datos = {};
        ajx.enviar_peticion(app.ini_productos, "", "/productos.xml", datos);
    },

          /* <h1>LUGITEC F/T</h1><hr/>
         <p>ESCORIA SINTÉTICA LUGITEC F/T:  PRODUCTO DESULFURANTE Y CAPTADOR DE INCLUSIONES PARA HORNO ELECTRICO ARCO Y PARA HORNOS DE INDUCCIÓN, PUEDE SER UTILIZADO EN ACEROS MUERTOS AL ALUMINIO, ACERO MOLDEADO Y ACEROS QUE TIENEN INYECCIÓN DE ALAMBRE DE CALCIO. TAMBIEN ES APLICADO EN HORNO OLLA. <a href="#" onclick="window.open('http://192.168.1.84:8000/pdf', '_blank', 'location=no')">Consultar especificacion</a></p>*/


    debug: function(page)
    {
        //app.login();
        //app.add_std();
        //app.add_std();
        //$.mobile.changePage("#page_add_std");
    },
    
    home: function()
    {
        $.mobile.changePage("#home");
    },
    logout: function()
    {
        $.ajax({
            type: 'POST',
            data: {},
            //url: app.server+'/logout/',
            url: app.server+'/appmovil.php',
            success: function(data)
            { 
                data_json = JSON.parse(data)
                if( data_json.logut == "1"){
                    $.mobile.changePage("#page_login");
                }
                else{alert("error al comunicarse con el servidor");}
            },
            error: function()
            {
                alert('error al comunicarse con el servidor');
            }
        });
    }

};


/*operaciones con imagenes*/
var Imagen = 
{

    image: null,
    id_image: 0,
    muestras: null,

    recibir_info: function (data){
        json = ajx.parse_json(data);
        if (len(json) == 0) { 
            alert("no se recibieron datos");
            return;
        }
        switch (json.type_response) { 
            case "get_analisis":
                app.llenar_tabla(json);
                break;
            case "set_id_image":
                Image.id_image = json.id_image;
                break;
        }
    },

/*enviar peticion al servidor para realizar el analisis de la foto actual
al recibir repuesta llama a funcion para el llenado de la tabla con el analisis recibido*/
    analizar_foto: function()
    {
        var data = {
            "operacion":"analizar_imagen",
            "id_im":image.id_im
        }
        ajx.enviar_peticion(Imagen.recibir_info,"","appmovil",data);
    },

/*envia imagen a servidor*/ 
    send_image: function()
    {
        var data = {
            'image': Imagen.image,
            'operacion': "save_image"
        };
        ajx.enviar_peticion(Imagen.recibir_info, "", "/appmovil-image/", data);
    },

    // funcion llamada al presionar boton bt_analizar
    bt_analizar_foto: function()
    {
        if (app.imagen != null){
            app.send_image("analizar");
            alert("la muestra a sido eviada para su analisis espere porfavor!");
        }
        else{
            //aler("error al tomar imagen")
        }
    },

/* funcion que se ejecuta al dar click en el boton bt_add_std
envia peticion al servidor para pedir los clientes registrados y poder filtrar muestras
envia imagen a servidor muestras el ususario se ocupa de filtrar muestras*/
    filtros_std: function(data)
    {
        data_json = JSON.parse(data)
        if ( data_json.session_iniciada == "1") {
            var c = data_json.clientes;
            var html = "<option>Filtrar por cliente</option>";
            for (var i = 0; i < c.length; i++) {
                html = html + "<option "+"value='"+c[i]+"'>"+c[i]+"</option>"
            }
            html = html + "<option value='all'>incluir todos</option>"
            $('#filtro_cliente').html(html)
            $.mobile.changePage("#page_add_std");   
            app.send_image(); 
        }
        else {
            alert("session no iniciada");
        }
    },

    bt_add_std: function()
    {
        var date = new Date();
        if(document.getElementById("filtro_mes").value == "no_select")
            document.getElementById("filtro_mes").value = app.meses[date.getMonth()];
        if(document.getElementById("filtro_año").value == "no_select")
            document.getElementById("filtro_año").value = date.getFullYear();  
        datos = {
            'operacion':'filtros',
            'f':'clientes'
        };
        ajx.enviar_peticion(Imagen.filtros, "", "appmovil", datos);    
    },

/*envia peticion al servidor para establer la relacion entre la imagen y el analisis de la muestra*/
    add_std: function(no_analisis)
    {
        $.ajax({
            type: 'POST',
            data: {'f':'add_std', 'id_im':app.id_im, 'no_analisis':no_analisis},
            //url: app.server+'/add_std/',
            url: app.server+'/appmovil.php',
            success: function(data)
            { 
                data_json = JSON.parse(data)
                if( data_json.session_iniciada == "1"){
                    alert("se agrego patron al numero de analisis: "+no_analisis);
                }
                else{alert("session no iniciada");}
            },
            error: function()
            {
                //alert('nombre de usuario o contraseña incorrectos');
            }
        });
    },

    take_image: function(){
        navigator.camera.getPicture(Imagen.onPhotoDataSuccess, Imagen.onFail,  { quality: 20,
        allowEdit: true, destinationType: navigator.camera.DestinationType.DATA_URL });
    },

    onFail: function(message) 
    {
            //alert('Failed because: ' + message);
    },

    onPhotoDataSuccess: function(imageData) 
    {
        Imagen.image = imageData;
        if(Imagen.image){
            var photo = document.getElementById('photo');
            photo.style.display = 'block';
            photo.src = "data:image/jpeg;base64," + Imagen.image;
            $.mobile.changePage("#page_take_potho");
            Imagen.send_image();
        }
    }
};

/*fuciones para lectura de codigos QR*/
var qr = 
{

    get_datos: function(data)
    {
        var data_json = JSON.parse(data);
        //if( data_json.session_iniciada == "1") // se tiene una session iniciada
        var analisis = data_json.analisis;
        app.llenar_tabla_analisis(analisis);
    },

    leer_qr: function ()
    {
        //$.mobile.changePage("#page_analisis");
        cordova.plugins.barcodeScanner.scan
        (
            function (result)
            {
                datos = {
                    'operacion': 'get_analisis',
                    'id_analisis': result.text
                };
                ajx.enviar_peticion(qr.get_datos, "", "/appmovil-qr/", datos);
                      },
            function (error){alert("Scanning faile: "+ error);}  
        );    
    }


};

//app.initialize();
