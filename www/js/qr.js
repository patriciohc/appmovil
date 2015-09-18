
//var server = 'http://192.168.1.87:8000'

function leer_qr()
{
	cordova.plugins.barcodeScanner.scan
	(
		function (result)
		{
			alert("we got a barcode\n"+ "Result: " + result.text);
              	},
		function (error){alert("Scanning faile: "+ error);}  
      	);    
}


function get_datos()
{
	$.ajax({
		type: 'POST',
	        data: {'id_analisis': id_analisis},
	        url: app.server+'/get_datos.php/',
	        success: function(data){ 
                	data_json = JSON.parse(data)
			//¿se tiene secion iniciada?
                	if( data_json.session_iniciada == "1"){
                		app.llenar_tabla_datos(data_json)                    
                	}
                	else{alert("error al intentar obtener informacion");}
	        },
	       	error: function(){
	      		alert('error al comunicarse con el servidor');
	     	}
	});
}


