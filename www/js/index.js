/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = 
{

	imagen: null,
	id_im: 0,
	server: 'http://192.168.1.87:8000',
	//server: 'http://10.0.2.2:8000',
	meses: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
	muestras: null,
	prd_act: 0,
	xmlDoc: null,
	
	// Application Constructor
	initialize: function() 
	{
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() 
	{
        	// boton toma foto
        	//var takePhoto = document.getElementById('takePhoto');  
        	//takePhoto.addEventListener('click', app.takePhoto, false);
        	var bt_analizar = document.getElementById('bt_analizar');  
        	bt_analizar.addEventListener('click', app.bt_analizar_foto, false);  
		//var home = document.getElementById('home');  
		//home.addEventListener('click', app.home, false); 
		//var logout = document.getElementById('boton_logout');  
		//logout.addEventListener('click', app.logout, false);  
		var login = document.getElementById('boton_login');  
		login.addEventListener('click', app.login, false);  
		
		var bt_add_std = document.getElementById('bt_add_std');  
		bt_add_std.addEventListener('click', app.bt_add_std, false);
		
		var bt_save_step1 = document.getElementById('bt_save_step1');  
		bt_save_step1.addEventListener('click', app.save_step1, false);  
		var filtro_cliente = document.getElementById('filtro_cliente');  
		filtro_cliente.addEventListener('change', app.change_filtros, false);  
		$( "#filtro_año" ).bind( "click", app.change_filtros);
		filtro_cliente.addEventListener('change', app.change_filtros, false);  
		var filtro_cliente = document.getElementById('filtro_mes');  
		filtro_cliente.addEventListener('change', app.change_filtros, false);  
		var select_muestra = document.getElementById('muestras');  
		select_muestra.addEventListener('change', app.change_select_muestra, false);  
		var bt_sgt_prd = document.getElementById('bt_sgt_prd');
		bt_sgt_prd.addEventListener('click',app.sgt_producto);
		
		
		//document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	//onDeviceReady: function() {
	//    app.receivedEvent('deviceready');
	//},
	// Update DOM on a Received Event
	/*receivedEvent: function(id) {
	    var parentElement = document.getElementById(id);
	    var listeningElement = parentElement.querySelector('.listening');
	    var receivedElement = parentElement.querySelector('.received');
	
	    listeningElement.setAttribute('style', 'display:none;');
	    receivedElement.setAttribute('style', 'display:block;');
	
	    console.log('Received Event: ' + id);
	},*/

// llena tabla con los analisis que contiene data
	llenar_tabla_analisis: function(data) 
	{
		$.mobile.changePage("#page_analisis");
		var tabla = document.getElementById('table_resultados');
		// Crear sección <thead>
		var thead = document.createElement('thead');
		tabla.appendChild(thead);
		// Añadir una fila a la sección <thead>
		var fila = document.createElement('tr');
		thead.appendChild(fila);
		// Añadir las tres columnas de la fila de <thead>
		var cabecera = document.createElement('th');
		cabecera.innerHTML = 'Parametro';
		fila.appendChild(cabecera);
		cabecera = document.createElement('th');
		cabecera.innerHTML = 'Resultado';
		fila.appendChild(cabecera);
		
		// Crear sección <tbody>
		var tbody = document.createElement('tbody');
		tabla.appendChild(tbody);
		// Añadir una fila a la sección <tbody>
		fila = document.createElement('tr');
		tbody.appendChild(fila);
		var celda = document.createElement('th');
		celda.innerHTML = 'SiO2';
		fila.appendChild(celda);
		celda = document.createElement('th');
		celda.innerHTML = data_json.SiO2;
		fila.appendChild(celda);
		
		// Añadir una fila a la sección <tbody>
		fila = document.createElement('tr');
		tbody.appendChild(fila);
		var celda = document.createElement('th');
		celda.innerHTML = 'Al2O3';
		fila.appendChild(celda);
		celda = document.createElement('th');
		celda.innerHTML = data_json.Al2O3;
		fila.appendChild(celda);
		
		/// Añadir una fila a la sección <tbody>
		fila = document.createElement('tr');
		tbody.appendChild(fila);
		var celda = document.createElement('th');
		celda.innerHTML = 'FeO';
		fila.appendChild(celda);
		celda = document.createElement('th');
		celda.innerHTML = data_json.FeO;
		fila.appendChild(celda);
		
		fila = document.createElement('tr');
		tbody.appendChild(fila);
		var celda = document.createElement('th');
		celda.innerHTML = 'CaO';
		fila.appendChild(celda);
		celda = document.createElement('th');
		celda.innerHTML = data_json.FeO;
		fila.appendChild(celda);
		
		fila = document.createElement('tr');
		tbody.appendChild(fila);
		var celda = document.createElement('th');
		celda.innerHTML = 'MgO';
		fila.appendChild(celda);
		celda = document.createElement('th');
		celda.innerHTML = data_json.MgO;
		fila.appendChild(celda);
		
		fila = document.createElement('tr');
		tbody.appendChild(fila);
		var celda = document.createElement('th');
		celda.innerHTML = 'MnO';
		fila.appendChild(celda);
		celda = document.createElement('th');
		celda.innerHTML = data_json.MnO;
		fila.appendChild(celda);                  
	},

			   // enviar peticion al servidor para realizar el analisis de la foto actual
			   // al recibir repuesta llama a funcion para el llenado de la tabla con el analisisi recibido
	analizar_foto: function()
	{
		$.ajax({
			type: 'POST',
			data: {'id_im': app.id_im},
			url: app.server+'/analizar_image/',
			success:function(data)
			{ 
				data_json = JSON.parse(data)
				if( data_json.session_iniciada == "1") // se tiene una session iniciada
					app.llenar_tabla_analisis(data);                    
			},
			error:function()
			{
				alert('error al comunicarse con el servidor');
			}
		});
	
	},


	// envia imagen a servidor 
	send_image: function(funcion)
	{
		$.ajax({
			type: 'POST',
			data: {'imagen': app.imagen},
			url: app.server+'/save_image/',
			success: function(data)
			{ 
				data_json = JSON.parse(data)
				if( data_json.session_iniciada == "1"){ // se tiene una session iniciada
					app.id_im = data_json.id_im;
					if (funcion == 'analizar') app.analizar_foto();                    
				}
				else{alert("imagen no recibida");}
			},
			error: function()
			{
				alert('error al comunicarse con el servidor');
			}
		});
	},


	// funcion llamada al presionar boton bt_analizar
	ibt_analizar_foto: function()
	{
		if (app.imagen != null){
			app.send_image("analizar");
			alert("la muestra a sido eviada para su analisis espere porfavor!");
		}
		else{
				  //aler("error al tomar imagen")
		}
	},

		  // funcion que se ejecuta al dar click en el boton bt_add_std
		  // envia peticion al servidor para pedir los clientes registrados y poder filtrar muestras
		  // envia imagen a servidor muestras el ususario se ocupa de filtrar muestras
	bt_add_std: function()
	{
		var date = new Date();
		if(document.getElementById("filtro_mes").value == "no_select")
			document.getElementById("filtro_mes").value = app.meses[date.getMonth()];
		if(document.getElementById("filtro_año").value == "no_select")
			document.getElementById("filtro_año").value = date.getFullYear();  
		$.ajax({
			type: 'POST',
			data: {'f':'clientes'},
			url: app.server+'/filtros/',
			success: function(data)
			{ 
				data_json = JSON.parse(data)
				if( data_json.session_iniciada == "1"){
					var c = data_json.clientes;
					var html = "<option>Filtrar por cliente</option>";
					for(var i=0; i<c.length; i++){
						html = html + "<option "+"value='"+c[i]+"'>"+c[i]+"</option>"
					}
					html = html + "<option value='all'>incluir todos</option>"
					$('#filtro_cliente').html(html)
					$.mobile.changePage("#page_add_std");   
					app.send_image(); 
				}
				else{alert("session no iniciada");}
			},
			error: function()
			{
				//alert('nombre de usuario o contraseña incorrectos');
			}
		});
	},

	// funcion que se ejecuta al filtrar muestras mediante los select(cliente, año, y mes)
	// procesa la informacion recibida del servidor y añade un lista de las muestras obtenidas en el filtrado
	// añade evento a cada item de las lista
	change_filtros: function()
	{
		cliente = document.getElementById("filtro_cliente").value;
		año = document.getElementById("filtro_año").value;        
		mes = document.getElementById("filtro_mes").value;
		if(año == "no_select")return true;
		if(mes == "no_select") return true;             
		if(cliente == 'all') cliente = "";
		if(mes == "all") mes = "";   
		//alert("año: "+año+", mes: "+mes+", cliente: "+cliente);         
		$.ajax({
			type: 'POST',
			data:
			{	
				'f':'muestras',
				'cliente':cliente,
				'anio':año,
				'mes':mes
			},
			url: app.server+'/filtros/',
			success: function(data)
			{ 
				data_json = JSON.parse(data)
				if( data_json.session_iniciada == "1"){
					app.muestras = data_json.muestras;
					//var select = document.getElementById("muestras");
					var lista = document.getElementById("muestras");
					lista.innerHTML = "";
					var item = "";
					var dir_img = ""
					for(var i=0; i<app.muestras.length; i++){
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
			error: function()
			{
			       //alert('nombre de usuario o contraseña incorrectos');
			}
		});
		
	},
		
			// envia peticion al servidor para establer la relacion entre la imagen y el analisis de la muestra
	add_std: function(no_analisis)
	{
		$.ajax({
			type: 'POST',
			data: {'f':'add_std', 'id_im':app.id_im, 'no_analisis':no_analisis},
			url: app.server+'/add_std/',
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



	/****funcion utlizada anteriormente para tomar la foto de la muestra de escoria*************************
takePhoto: function(){
navigator.camera.getPicture(app.onPhotoDataSuccess, app.onFail,  { quality: 20,
allowEdit: true, destinationType: navigator.camera.DestinationType.DATA_URL });
},
	 */


	onPhotoDataSuccess: function(imageData) 
	{
		app.imagen = imageData;
			if(app.imagen){
				var photo = document.getElementById('photo');
				photo.style.display = 'block';
				photo.src = "data:image/jpeg;base64," + imageData;
				$.mobile.changePage("#page_take_potho");
			}
		},
		onFail: function(message) 
		{
			//alert('Failed because: ' + message);
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
				url: app.server+'/logout/',
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
		},

	login: function()
	{
		var user = $('#user').val();
		var password = $('#password').val();
		if (user == 'patricio'){
			$.mobile.changePage("#page_home");
	       	} 
		$.ajax({
			type: 'POST',
			data: {'user':user, 'password':password},
			url: app.server+'/login/',
			success: function(data)
			{ 
				data_json = JSON.parse(data)
				if( data_json.validate == "1"){
					$.mobile.changePage("#page_home");
				}
				else{alert("nombre de usuario o contraseña incorrectos");}
			},
			error: function()
			{
				alert('nombre de usuario o contraseña incorrectos');
			}
		});
	},

	save_step1: function()
	{
		$.mobile.changePage("#page_save1");
	},
	// verifica si existe alguna session iniciada
	session_ini: function()i
	{
		$.ajax({
			type: 'POST',
			data: {},
			url: app.server+'/session_iniciada/',
			success: function(data)
			{ 
				data_json = JSON.parse(data)
				if( data_json.session_iniciada == "1"){
					$.mobile.changePage("#home");
				}
				//else{alert("nombre de usuario o contraseña incorrectos");}
			},
			error: function()
			{
				//alert('nombre de usuario o contraseña incorrectos');
			}
		});
	},

	get_productos:function()
	{
		$.ajax({
			type: 'GET',
			data: {},
			url: app.server+'/productos/',
			success: function(data)
			{
				app.xmlDoc = data; 
				app.sgt_producto();
			},
			error: function()
			{
				alert('error al comunicarse con el servidor');
			}
		});
	},

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


	      /* <h1>LUGITEC F/T</h1><hr/>
		 <p>ESCORIA SINTÉTICA LUGITEC F/T:  PRODUCTO DESULFURANTE Y CAPTADOR DE INCLUSIONES PARA HORNO ELECTRICO ARCO Y PARA HORNOS DE INDUCCIÓN, PUEDE SER UTILIZADO EN ACEROS MUERTOS AL ALUMINIO, ACERO MOLDEADO Y ACEROS QUE TIENEN INYECCIÓN DE ALAMBRE DE CALCIO. TAMBIEN ES APLICADO EN HORNO OLLA. <a href="#" onclick="window.open('http://192.168.1.84:8000/pdf', '_blank', 'location=no')">Consultar especificacion</a></p>*/


	debug: function(page)
	{
		//app.login();
		//app.add_std();
		//app.add_std();
		//$.mobile.changePage("#page_add_std");
	}

};

//app.initialize();
