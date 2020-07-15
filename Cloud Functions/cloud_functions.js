const functions = require('firebase-functions');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

const otherConfig = Object.assign({},functions.config().firebase);
otherConfig.databaseURL='https://tfg-futbol-prueba.firebaseio.com/';
const otherApp=admin.initializeApp(otherConfig, 'TFG FUTBOL');

const config_jornada=Object.assign({},functions.config().firebase);
config_jornada.databaseURL='https://tfg-futbol-jornada.firebaseio.com/';
const jornada_app=admin.initializeApp(config_jornada, 'TFG FUTBOL JORNADA');

const config_partidos=Object.assign({},functions.config().firebase);
config_partidos.databaseURL='https://tfg-futbol-calendario.firebaseio.com/';
const partidos_app=admin.initializeApp(config_partidos, 'TFG FUTBOL PARTIDOS');

const config_alineacion=Object.assign({},functions.config().firebase);
config_alineacion.databaseURL='https://tfg-futbol-alineacion.firebaseio.com/';
const alineacion_app=admin.initializeApp(config_alineacion, 'TFG FUTBOL ALINEACION');

const config_clasificacion=Object.assign({},functions.config().firebase);
config_clasificacion.databaseURL='https://tfg-futbol-clasificacion.firebaseio.com/';
const clasificacion_app=admin.initializeApp(config_clasificacion, 'TFG FUTBOL CLASIFICACION');

const config_plantilla=Object.assign({},functions.config().firebase);
config_plantilla.databaseURL='https://tfg-futbol-plantilla.firebaseio.com/';
const plantilla_app=admin.initializeApp(config_plantilla, 'TFG FUTBOL PLANTILLA');
//const config_partidos=Object.assign({},functions.config().firebase);

const rp = require('request-promise');
const cheerio=require('cheerio');
const axios=require('axios');
const fs = require('fs');
const https=require('https');


/*exports.prueba_nuevo2=functions.pubsub.schedule('every 2 minutes').onRun((context)=>{
	var nuewPostKey = admin.database(otherApp).ref('partido').push().key;
	const msgroot = admin.database(otherApp).ref('partido/'+nuewPostKey);
	msgroot.set({
		partidos_equipo_local:"Madrid",
		partidos_equipo_visitante:"Barsa",
		partidos_resultado:"4-0",
	});
});*/

function getJornadaLaLiga(){
	var jornadaroot = admin.database(jornada_app).ref('laliga');
	jornadaroot.on("value",function(snapshot){
		return snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
}

function getJornadaBundesliga(){
	var jornadaroot = admin.database(jornada_app).ref('bundesliga');
	jornadaroot.on("value",function(snapshot){
		return snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
}

function getJornadaPremier(){
	var jornadaroot = admin.database(jornada_app).ref('premier');
	jornadaroot.on("value",function(snapshot){
		return snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
}

function getJornadaSerieA(){
	var jornadaroot = admin.database(jornada_app).ref('seriea');
	jornadaroot.on("value",function(snapshot){
		return snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
}


/*
function setJornadaLaLiga(){
	var jornada;
	var jornadaroot = admin.database(jornada_app).ref('laliga');
	var jornadaroot1 = admin.database(jornada_app).ref('laliga/value');
	jornadaroot1.on("value",function(snapshot){
		jornada = snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});

	setTimeout(() => { 
		var nueva_jornada=jornada+1;
		jornadaroot.update({"value":nueva_jornada});
	},10000);
}

function setJornadaBundesliga(){
	var jornada;
	var jornadaroot = admin.database(jornada_app).ref('bundesliga');
	var jornadaroot1 = admin.database(jornada_app).ref('bundesliga/value');
	jornadaroot1.on("value",function(snapshot){
		jornada = snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
	setTimeout(() => { 
		var nueva_jornada=jornada+1;
		jornadaroot.update({"value":nueva_jornada});
	},10000);
}

function setJornadaPremier(){
	var jornada;
	var jornadaroot = admin.database(jornada_app).ref('premier');
	var jornadaroot1 = admin.database(jornada_app).ref('premier/value');
	jornadaroot1.on("value",function(snapshot){
		jornada = snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
	setTimeout(() => { 
		var nueva_jornada=jornada+1;
		jornadaroot.update({"value":nueva_jornada});
	},10000);
}

function setJornadaSerieA(){
	var jornada;
	var jornadaroot = admin.database(jornada_app).ref('seriea');
	var jornadaroot1 = admin.database(jornada_app).ref('seriea/value');
	jornadaroot1.on("value",function(snapshot){
		jornada = snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});

	setTimeout(() => { 
		var nueva_jornada=jornada+1;
		jornadaroot.update({"value":nueva_jornada});
	},10000);
}

exports.ActualizaJornada3=functions.pubsub.schedule('every 2 minutes').onRun((context)=>{
	setJornadaLaLiga();
	setJornadaPremier();
	setJornadaSerieA();
	setJornadaBundesliga();
});

*/


/********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
***********************  LA LIGA SANTANDER **************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************/

exports.Partido_Alineacion_ActualizaPartido=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i=getJornadaLaLiga();
	const url='https://www.resultados-futbol.com/primera2020/grupo1';
	const partidos=[];

	axios(url+'/jornada'+i)
		.then(response=>{
			var html=response.data;
			var $ = cheerio.load(html);
			var jornada = $('#tabla1 tbody > tr');
			var jor="Jornada "+i;
			

			jornada.each(function(){

				var result=$(this).attr('class').localeCompare('vevent');
				if (result===1) {
					var local=$(this).find('.equipo1 img').attr('alt');
					var foto_local=$(this).find('.equipo1 img').attr('src');
					var visitante=$(this).find('.equipo2 img').attr('alt');
					var foto_visitante=$(this).find('.equipo2 img').attr('src');
					var resultado=$(this).find('.rstd .url .clase').text();
					var fecha=$(this).find('.fecha').text();
					var fecha1=fecha.substr(9,9);

					//console.log(jor+" "+local+" "+resultado+" "+visitante)

					if (local==='Atlético')
						local='Atlético Madrid'
					if (local === 'Athletic')
						local='Athletic Bilbao'
					if (local === 'Real')
						local ='Real Valladolid'
					if (local === 'Sociedad')
						local='Real Sociedad'
					if (local === 'R. Sociedad')
						local='Real Sociedad'
					if (local === 'Celta')
						local = 'Celta de Vigo'
					if (visitante==='Atlético')
						visitante='Atlético Madrid'
					if (visitante === 'Athletic')
						visitante='Athletic Bilbao'
					if (visitante === 'Real')
						visitante ='Real Valladolid'
					if (visitante === 'R. Sociedad')
						visitante='Real Sociedad'
					if (visitante ==='Sociedad')
						visitante='Real Sociedad'
					if (visitante === 'Celta')
						visitante = 'Celta de Vigo'

					if (resultado === "")
						resultado="Aplazado"

					partidos.push({
						partidos_temporada:"Temporada2020",
						partidos_jornada:jor,
						partidos_foto_local:foto_local,
						partidos_equipo_local:local,
						partidos_foto_visitante:foto_visitante,
						partidos_equipo_visitante:visitante,
						partidos_resultado:resultado,
						partidos_fecha:fecha1,
					});
					//console.log("entra");

				}else{
					//console.log("no entra");
				}
				return true;
			});
			return true;
		})
		.catch(console.error);


	setTimeout(() => {   

		var partido="";
		var partidoroot = admin.database(partidos_app).ref('calendario_laliga');
		partidoroot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<partidos.length;id++){
					if (childData.partidos_equipo_local===partidos[id].partidos_equipo_local && childData.partidos_equipo_visitante===partidos[id].partidos_equipo_visitante){
						var partidoroot1 = admin.database(partidos_app).ref('calendario_laliga/'+key);
						partidoroot1.update({"partidos_fecha":partidos[id].partidos_fecha, "partidos_resultado":partidos[id].partidos_resultado});
					}
				}

			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 30000);

	setTimeout(() => {   
		var urls_alineacion=['Real-Madrid', 'Barcelona',
		'Getafe', 'Atletico-Madrid',
		'Sevilla','Real-Sociedad',
		'Valencia-Cf','Villarreal',
		'Athletic-Bilbao','Granada',
		'Levante','Osasuna',
		'Betis','Alaves',
		'Valladolid','Eibar',
		'Celta','Mallorca',
		'Leganes','Espanyol'];

		var urls_equipos=['Real Madrid','Barcelona', 'Getafe', 'Atlético Madrid', 'Sevilla', 'Real Sociedad', 'Valencia',
		'Villarreal', 'Athletic Bilbao', 'Granada', 'Levante', 'Osasuna', 'Real Betis', 'Alavés', 'Real Valladolid', 
		'Eibar', 'Celta de Vigo', 'Real Mallorca', 'Leganés', 'Espanyol'];

		var enlace='https://www.resultados-futbol.com/partido/';

		var alineaciones=[];

		const alineaciones_descargadas=[];
		const alineaciones_total=[];

		var longitud=partidos.length;

		for (var p=0;p<longitud;p++){

			var partido=partidos.pop();

			var local=partido.partidos_equipo_local;
			var visitante=partido.partidos_equipo_visitante;


			var indice_local;
			var indice_visitante;

			for (var x=0;x<urls_equipos.length;x++){
				if(local===urls_equipos[x]){
					indice_local=x;
				}
				if(visitante===urls_equipos[x]){
					indice_visitante=x;
				}
			}

			var enlace_final=enlace+urls_alineacion[indice_local]+"/"+urls_alineacion[indice_visitante];

			alineaciones_total.push(enlace_final);

			var temporada="Temporada2020";
			var jornada="Jornada "+i;

			//console.log(enlace_final);

			axios(enlace_final)
				.then(response=>{

					alineaciones_descargadas.push(enlace_final);

					var html=response.data;
					//console.log(html);
					var $ = cheerio.load(html);

					var alineacion_equipo_local=$('.nteam.nteam1 a').text();
					var alineacion_equipo_visitante=$('.nteam.nteam2 a').text();

					if (alineacion_equipo_local==='Atlético')
						alineacion_equipo_local='Atlético Madrid'
					if (alineacion_equipo_local === 'Athletic')
						alineacion_equipo_local='Athletic Bilbao'
					if (alineacion_equipo_local === 'Real')
						alineacion_equipo_local ='Real Valladolid'
					if (alineacion_equipo_local === 'Sociedad')
						alineacion_equipo_local='Real Sociedad'
					if (alineacion_equipo_local === 'R. Sociedad')
						alineacion_equipo_local='Real Sociedad'
					if (alineacion_equipo_local === 'Celta')
						alineacion_equipo_local = 'Celta de Vigo'

					if (alineacion_equipo_visitante==='Atlético')
						alineacion_equipo_visitante='Atlético Madrid'
					if (alineacion_equipo_visitante === 'Athletic')
						alineacion_equipo_visitante='Athletic Bilbao'
					if (alineacion_equipo_visitante === 'Real')
						alineacion_equipo_visitante ='Real Valladolid'
					if (alineacion_equipo_visitante === 'Sociedad')
						alineacion_equipo_visitante='Real Sociedad'
					if (alineacion_equipo_visitante === 'R. Sociedad')
						alineacion_equipo_visitante='Real Sociedad'
					if (alineacion_equipo_visitante === 'Celta')
						alineacion_equipo_visitante = 'Celta de Vigo'


					console.log(alineacion_equipo_local+" "+alineacion_equipo_visitante);

					var equipo_local = $('.team.team1 ul > li');
					var equipo_visitante= $('.team.team2 ul > li');


					var eventos=$('#listado_eventos #teams_box .contentitem > .evento');

					var lesiones_local=[];
					var lesiones_visitante=[];
					var asistencias_local=[];
					var asistencias_visitante=[];
					var rojas_local=[];
					var rojas_visitante=[];
					var amarillas_local=[];
					var amarillas_visitante=[];
					var goles_local=[];
					var goles_visitante=[];
					var amarilla_roja_local=[];
					var amarilla_roja_visitante=[];

					eventos.each(function(){
						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de "){
							var jugador=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de "){
							var jugador1=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador1);
						}

						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de falta"){
							var jugador2=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador2);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de falta"){
							var jugador3=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador3);
						}
						if($(this).find('.left.event_11') && $(this).find('.left.event_11 small').text()==="Gol de penalti"){
							var jugador4=$(this).find('.left.event_11 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador4);
						}
						if($(this).find('.right.event_11') && $(this).find('.right.event_11 small').text()==="Gol de penalti"){
							var jugador5=$(this).find('.right.event_11 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador5);
						}
						if($(this).find('.left.event_12') && $(this).find('.left.event_12 small').text()==="Gol de "){
							var jugador6=$(this).find('.left.event_12 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador6);
						}
						if($(this).find('.right.event_12') && $(this).find('.right.event_12 small').text()==="Gol de "){
							var jugador7=$(this).find('.right.event_12 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador7);
						}

						if($(this).find('.left.event_8') && $(this).find('.left.event_8 small').text()==="T. Amarilla"){
							//console.log("entra amarilla");
							var jugador8=$(this).find('.left.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_local.push(jugador8);
						}
						if($(this).find('.right.event_8') && $(this).find('.right.event_8 small').text()==="T. Amarilla"){
							var jugador9=$(this).find('.right.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_visitante.push(jugador9);
						}
						if($(this).find('.left.event_5') && $(this).find('.left.event_5 small').text()==="Asistencia"){
							//console.log("entra asistencia");
							var jugador10=$(this).find('.left.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_local.push(jugador10);
						}
						if($(this).find('.right.event_5') && $(this).find('.right.event_5 small').text()==="Asistencia"){
							var jugador11=$(this).find('.right.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_visitante.push(jugador11);
						}
						if($(this).find('.left.event_10') && $(this).find('.left.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador12=$(this).find('.left.event_10 a').text();
							amarilla_roja_local.push(jugador12);
						}
						if($(this).find('.right.event_10') && $(this).find('.right.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador13=$(this).find('.right.event_10 a').text();
							amarilla_roja_visitante.push(jugador13);
						}
						if($(this).find('.left.event_4') && $(this).find('.left.event_4 small').text()==="Lesionado"){
							//console.log("entra Lesionado");
							var jugador14=$(this).find('.left.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_local.push(jugador14);
						}
						if($(this).find('.right.event_4') && $(this).find('.right.event_4 small').text()==="Lesionado"){
							var jugador15=$(this).find('.right.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_visitante.push(jugador15);
						}
						if($(this).find('.left.event_9') && $(this).find('.left.event_9 small').text()==="Tarjeta Roja a "){
							//console.log("entra roja");
							var jugador16=$(this).find('.left.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador16);
						}
						if($(this).find('.right.event_9') && $(this).find('.right.event_9 small').text()==="Tarjeta Roja a "){
							var jugador17=$(this).find('.right.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador17);
						}
						return true;
					});
			
				
					var est=0;
					equipo_local.each(function(){
						//console.log("entra local");
						//TITULAR/SUPLENTE
						var estado;
						if(est<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est=est+1;

						var nombre=$(this).find('.align-player').text();

						//console.log(nombre+" "+alineacion_equipo_local+" "+estado);
						var amarilla="0";
						for (a in amarillas_local){
							if(nombre===amarillas_local[a]){
								amarilla="1";
							}
						}
						var gol=0;
						for (b in goles_local){
							if(nombre===goles_local[b]){
								gol=gol+1;
							}
						}
						gol=String(gol);
						var cambio1;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1=$(this).find('.align-events span.flaticon-up12').text();
							cambio=cambio1.substr(0,2);
						}else{
							cambio="";
						}
						var roja="0";
						for(a in rojas_local){
							if(nombre===rojas_local[a]){
								roja="1";
							}
						}
						var lesion="0";
						for (a in lesiones_local){
							if (nombre===lesiones_local[a]){
								lesion="1";
							}
						}
						var asistencia=0;
						for (a in asistencias_local){
							if (asistencias_local[a] === nombre)
								asistencia=asistencia+1
						}
						asistencia=String(asistencia);

						for (a in amarilla_roja_local){
							if(nombre===amarilla_roja_local[a]){
								amarilla="2";
								roja="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio,
							alineacion_estado:estado,
							alineacion_roja:roja,
							alineacion_equipo:alineacion_equipo_local,
							alineacion_lesion:lesion,
							alineacion_jugador:nombre,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla,
							alineacion_gol:gol,		
						});

						return true;

					});


					var est1=0;
					equipo_visitante.each(function(){
						//TITULAR/SUPLENTE
						var estado;
						if(est1<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est1=est1+1;

						var nombre_visitante=$(this).find('.align-player').text();
						//console.log(nombre+" "+alineacion_equipo_visitante+" "+estado);
						var amarilla_visitante="0";
						for (b in amarillas_visitante){
							if(nombre_visitante===amarillas_visitante[b]){
								amarilla_visitante="1";
							}
						}
						var gol_visitante=0;
						for (b in goles_visitante){
							if(nombre_visitante===goles_visitante[b]){
								//console.log("gol visitante encaja");
								gol_visitante=gol_visitante+1;
								//console.log(gol_visitante);
							}
						}
						gol_visitante=String(gol_visitante);
						var cambio1_visitante;
						var cambio_visitante;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1_visitante=$(this).find('.align-events span.flaticon-up12').text();
							cambio_visitante=cambio1_visitante.substr(0,2);
						}else{
							cambio_visitante="";
						}
						var roja_visitante="0";
						for(b in rojas_visitante){
							if(nombre_visitante===rojas_visitante[b]){
								roja_visitante="1";
							}
						}
						var lesion_visitante="0";
						for (b in lesiones_visitante){
							if (nombre_visitante===lesiones_visitante[b]){
								lesion_visitante="1";
							}
						}
						var asistencia_visitante=0;
						for (b in asistencias_visitante){
							if (asistencias_visitante[b] === nombre_visitante)
								asistencia_visitante=asistencia_visitante+1
						}
						asistencia_visitante=String(asistencia_visitante);

						for (b in amarilla_roja_visitante){
							if(nombre_visitante===amarilla_roja_visitante[b]){
								amarilla_visitante="2";
								roja_visitante="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia_visitante,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio_visitante,
							alineacion_estado:estado,
							alineacion_roja:roja_visitante,
							alineacion_equipo:alineacion_equipo_visitante,
							alineacion_lesion:lesion_visitante,
							alineacion_jugador:nombre_visitante,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla_visitante,
							alineacion_gol:gol_visitante,		
						});
						return true;

					});
					return true;
				})
				.catch(console.error);

		}

		setTimeout(() => {   

			alineaciones_por_descargar=[];

			for (var z=0;z<alineaciones_total.length;z++){
				if (alineaciones_descargadas.includes(alineaciones_total[z])){
					//nada
				}else{
					alineaciones_por_descargar.push(alineaciones_total[z]);
					
				}
			}

			for (var m in alineaciones_por_descargar){
				var url_actual_alineacion=alineaciones_por_descargar[m];

				axios(url_actual_alineacion)
				.then(response=>{

					alineaciones_descargadas.push(enlace_final);

					var html=response.data;
					//console.log(html);
					var $ = cheerio.load(html);

					var alineacion_equipo_local=$('.nteam.nteam1 a').text();
					var alineacion_equipo_visitante=$('.nteam.nteam2 a').text();

					if (alineacion_equipo_local==='Atlético')
						alineacion_equipo_local='Atlético Madrid'
					if (alineacion_equipo_local === 'Athletic')
						alineacion_equipo_local='Athletic Bilbao'
					if (alineacion_equipo_local === 'Real')
						alineacion_equipo_local ='Real Valladolid'
					if (alineacion_equipo_local === 'Sociedad')
						alineacion_equipo_local='Real Sociedad'
					if (alineacion_equipo_local === 'R. Sociedad')
						alineacion_equipo_local='Real Sociedad'
					if (alineacion_equipo_local === 'Celta')
						alineacion_equipo_local = 'Celta de Vigo'

					if (alineacion_equipo_visitante==='Atlético')
						alineacion_equipo_visitante='Atlético Madrid'
					if (alineacion_equipo_visitante === 'Athletic')
						alineacion_equipo_visitante='Athletic Bilbao'
					if (alineacion_equipo_visitante === 'Real')
						alineacion_equipo_visitante ='Real Valladolid'
					if (alineacion_equipo_visitante === 'Sociedad')
						alineacion_equipo_visitante='Real Sociedad'
					if (alineacion_equipo_visitante === 'R. Sociedad')
						alineacion_equipo_visitante='Real Sociedad'
					if (alineacion_equipo_visitante === 'Celta')
						alineacion_equipo_visitante = 'Celta de Vigo'


					console.log(alineacion_equipo_local+" "+alineacion_equipo_visitante);

					var equipo_local = $('.team.team1 ul > li');
					var equipo_visitante= $('.team.team2 ul > li');


					var eventos=$('#listado_eventos #teams_box .contentitem > .evento');

					var lesiones_local=[];
					var lesiones_visitante=[];
					var asistencias_local=[];
					var asistencias_visitante=[];
					var rojas_local=[];
					var rojas_visitante=[];
					var amarillas_local=[];
					var amarillas_visitante=[];
					var goles_local=[];
					var goles_visitante=[];
					var amarilla_roja_local=[];
					var amarilla_roja_visitante=[];

					eventos.each(function(){
						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de "){
							var jugador=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de "){
							var jugador1=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador1);
						}

						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de falta"){
							var jugador2=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador2);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de falta"){
							var jugador3=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador3);
						}
						if($(this).find('.left.event_11') && $(this).find('.left.event_11 small').text()==="Gol de penalti"){
							var jugador4=$(this).find('.left.event_11 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador4);
						}
						if($(this).find('.right.event_11') && $(this).find('.right.event_11 small').text()==="Gol de penalti"){
							var jugador5=$(this).find('.right.event_11 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador5);
						}
						if($(this).find('.left.event_12') && $(this).find('.left.event_12 small').text()==="Gol de "){
							var jugador6=$(this).find('.left.event_12 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador6);
						}
						if($(this).find('.right.event_12') && $(this).find('.right.event_12 small').text()==="Gol de "){
							var jugador7=$(this).find('.right.event_12 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador7);
						}

						if($(this).find('.left.event_8') && $(this).find('.left.event_8 small').text()==="T. Amarilla"){
							//console.log("entra amarilla");
							var jugador8=$(this).find('.left.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_local.push(jugador8);
						}
						if($(this).find('.right.event_8') && $(this).find('.right.event_8 small').text()==="T. Amarilla"){
							var jugador9=$(this).find('.right.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_visitante.push(jugador9);
						}
						if($(this).find('.left.event_5') && $(this).find('.left.event_5 small').text()==="Asistencia"){
							//console.log("entra asistencia");
							var jugador10=$(this).find('.left.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_local.push(jugador10);
						}
						if($(this).find('.right.event_5') && $(this).find('.right.event_5 small').text()==="Asistencia"){
							var jugador11=$(this).find('.right.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_visitante.push(jugador11);
						}
						if($(this).find('.left.event_10') && $(this).find('.left.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador12=$(this).find('.left.event_10 a').text();
							amarilla_roja_local.push(jugador12);
						}
						if($(this).find('.right.event_10') && $(this).find('.right.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador13=$(this).find('.right.event_10 a').text();
							amarilla_roja_visitante.push(jugador13);
						}
						if($(this).find('.left.event_4') && $(this).find('.left.event_4 small').text()==="Lesionado"){
							//console.log("entra Lesionado");
							var jugador14=$(this).find('.left.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_local.push(jugador14);
						}
						if($(this).find('.right.event_4') && $(this).find('.right.event_4 small').text()==="Lesionado"){
							var jugador15=$(this).find('.right.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_visitante.push(jugador15);
						}
						if($(this).find('.left.event_9') && $(this).find('.left.event_9 small').text()==="Tarjeta Roja a "){
							//console.log("entra roja");
							var jugador16=$(this).find('.left.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador16);
						}
						if($(this).find('.right.event_9') && $(this).find('.right.event_9 small').text()==="Tarjeta Roja a "){
							var jugador17=$(this).find('.right.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador17);
						}
						return true;
					});
			
				
					var est=0;
					equipo_local.each(function(){
						//console.log("entra local");
						//TITULAR/SUPLENTE
						var estado;
						if(est<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est=est+1;

						var nombre=$(this).find('.align-player').text();

						//console.log(nombre+" "+alineacion_equipo_local+" "+estado);
						var amarilla="0";
						for (a in amarillas_local){
							if(nombre===amarillas_local[a]){
								amarilla="1";
							}
						}
						var gol=0;
						for (b in goles_local){
							if(nombre===goles_local[b]){
								gol=gol+1;
							}
						}
						gol=String(gol);
						var cambio1;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1=$(this).find('.align-events span.flaticon-up12').text();
							cambio=cambio1.substr(0,2);
						}else{
							cambio="";
						}
						var roja="0";
						for(a in rojas_local){
							if(nombre===rojas_local[a]){
								roja="1";
							}
						}
						var lesion="0";
						for (a in lesiones_local){
							if (nombre===lesiones_local[a]){
								lesion="1";
							}
						}
						var asistencia=0;
						for (a in asistencias_local){
							if (asistencias_local[a] === nombre)
								asistencia=asistencia+1
						}
						asistencia=String(asistencia);

						for (a in amarilla_roja_local){
							if(nombre===amarilla_roja_local[a]){
								amarilla="2";
								roja="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio,
							alineacion_estado:estado,
							alineacion_roja:roja,
							alineacion_equipo:alineacion_equipo_local,
							alineacion_lesion:lesion,
							alineacion_jugador:nombre,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla,
							alineacion_gol:gol,		
						});

						return true;

					});


					var est1=0;
					equipo_visitante.each(function(){
						//TITULAR/SUPLENTE
						var estado;
						if(est1<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est1=est1+1;

						var nombre_visitante=$(this).find('.align-player').text();
						//console.log(nombre+" "+alineacion_equipo_visitante+" "+estado);
						var amarilla_visitante="0";
						for (b in amarillas_visitante){
							if(nombre_visitante===amarillas_visitante[b]){
								amarilla_visitante="1";
							}
						}
						var gol_visitante=0;
						for (b in goles_visitante){
							if(nombre_visitante===goles_visitante[b]){
								//console.log("gol visitante encaja");
								gol_visitante=gol_visitante+1;
								//console.log(gol_visitante);
							}
						}
						gol_visitante=String(gol_visitante);
						var cambio1_visitante;
						var cambio_visitante;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1_visitante=$(this).find('.align-events span.flaticon-up12').text();
							cambio_visitante=cambio1_visitante.substr(0,2);
						}else{
							cambio_visitante="";
						}
						var roja_visitante="0";
						for(b in rojas_visitante){
							if(nombre_visitante===rojas_visitante[b]){
								roja_visitante="1";
							}
						}
						var lesion_visitante="0";
						for (b in lesiones_visitante){
							if (nombre_visitante===lesiones_visitante[b]){
								lesion_visitante="1";
							}
						}
						var asistencia_visitante=0;
						for (b in asistencias_visitante){
							if (asistencias_visitante[b] === nombre_visitante)
								asistencia_visitante=asistencia_visitante+1
						}
						asistencia_visitante=String(asistencia_visitante);

						for (b in amarilla_roja_visitante){
							if(nombre_visitante===amarilla_roja_visitante[b]){
								amarilla_visitante="2";
								roja_visitante="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia_visitante,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio_visitante,
							alineacion_estado:estado,
							alineacion_roja:roja_visitante,
							alineacion_equipo:alineacion_equipo_visitante,
							alineacion_lesion:lesion_visitante,
							alineacion_jugador:nombre_visitante,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla_visitante,
							alineacion_gol:gol_visitante,		
						});
						return true;

					});
					return true;
				})
				.catch(console.error);
			}

		}, 90000);


		
		setTimeout(() => {
			var jornada_equipo=[];

			var alineacionroot = admin.database(alineacion_app).ref('alineacion_laliga/alineacion_laliga_2019_2020');
			alineacionroot.on("value",function(snapshot){
				snapshot.forEach(function(childSnapshot) {
					var key = childSnapshot.key;
					var childData = childSnapshot.val();
					jornada_equipo.push({
							alineacion_asistencia:childData.alineacion_asistencia,
							alineacion_temporada:childData.alineacion_temporada,
							alineacion_cambio:childData.alineacion_cambio,
							alineacion_estado:childData.alineacion_estado,
							alineacion_roja:childData.alineacion_roja,
							alineacion_equipo:childData.alineacion_equipo,
							alineacion_lesion:childData.alineacion_lesion,
							alineacion_jugador:childData.alineacion_jugador,
							alineacion_jornada:childData.alineacion_jornada,
							alineacion_amarilla:childData.alineacion_amarilla,
							alineacion_gol:childData.alineacion_gol		
						});
				});
			}, function(errorObject){
				console.log("Error leyendo la jornada "+errorObject.code);
			});

			setTimeout(()=>{
				for (var i=0;i<alineaciones.length;i++){
					if(!jornada_equipo.includes(alineaciones[i])){
						var nuewPostKey=admin.database(alineacion_app).ref('alineacion_laliga/alineacion_laliga_2019_2020').push().key;
						admin.database(alineacion_app).ref('alineacion_laliga/alineacion_laliga_2019_2020/'+nuewPostKey).set({
							alineacion_asistencia:alineaciones[i].alineacion_asistencia,
							alineacion_temporada:alineaciones[i].alineacion_temporada,
							alineacion_cambio:alineaciones[i].alineacion_cambio,
							alineacion_estado:alineaciones[i].alineacion_estado,
							alineacion_roja:alineaciones[i].alineacion_roja,
							alineacion_equipo:alineaciones[i].alineacion_equipo,
							alineacion_lesion:alineaciones[i].alineacion_lesion,
							alineacion_jugador:alineaciones[i].alineacion_jugador,
							alineacion_jornada:alineaciones[i].alineacion_jornada,
							alineacion_amarilla:alineaciones[i].alineacion_amarilla,
							alineacion_gol:alineaciones[i].alineacion_gol,		
						});
					}
				}
			},200000);
		}, 150000);

	

	}, 30000);
});

exports.ClasificacionActualiza_1=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i;
	var jornadaroot1 = admin.database(jornada_app).ref('laliga/value');
	jornadaroot1.on("value",function(snapshot){
		i = snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
	const url_clasificacion='https://www.resultados-futbol.com/primera2020/grupo1/jornada'
	const clasificacion=[];

	setTimeout(() => {   

		axios(url_clasificacion+i)
			.then(response=>{
				var html=response.data;
				var $ = cheerio.load(html);
				var clasif = $('#tabla2 tbody > tr');
				var jor="Jornada "+i;
				

				clasif.each(function(){

					var equipo=$(this).find('a').text();
					var puntos=$(this).find('.pts').text();
					var posicion=$(this).find('th').text();
					var pjugados=$(this).find('.pj').text();
					var ganados=$(this).find('.win').text();
					var empatados=$(this).find('.draw').text();
					var perdidos=$(this).find('.lose').text();
					var gfavor=$(this).find('.f').text();
					var gcontra=$(this).find('.c').text();
					//console.log(jor+" "+local+" "+resultado+" "+visitante)

					if (equipo==='Atlético')
						equipo='Atlético Madrid'
					if (equipo === 'Athletic')
						equipo='Athletic Bilbao'
					if (equipo === 'Real')
						equipo ='Real Valladolid'
					if (equipo === 'Sociedad')
						equipo='Real Sociedad'
					if (equipo === 'R. Sociedad')
						equipo='Real Sociedad'
					if (equipo === 'Celta')
						equipo = 'Celta de Vigo'

					clasificacion.push({
						clasificacion_temporada:"Temporada2020",
						clasificacion_jornada:jor,
						clasificacion_posicion:parseInt(posicion),
						clasificacion_equipo:equipo,
						clasificacion_puntos:parseInt(puntos),
						clasificacion_partidos_jugados:parseInt(pjugados),
						clasificacion_ganados:parseInt(ganados),
						clasificacion_empatados:parseInt(empatados),
						clasificacion_perdidos:parseInt(perdidos),
						clasificacion_goles_favor:parseInt(gfavor),
						clasificacion_goles_contra:parseInt(gcontra),
					});
					//console.log("entra");
					return true;
					
				});
				return true;
			})
			.catch(console.error);
	}, 20000);

	setTimeout(() => {   

		var equipo="";
		var equiporoot = admin.database(clasificacion_app).ref('clasificacion_laliga');
		equiporoot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<clasificacion.length;id++){
					if (childData.clasificacion_jornada===clasificacion[id].clasificacion_jornada && 
						childData.clasificacion_temporada===clasificacion[id].clasificacion_temporada &&
						childData.clasificacion_equipo===clasificacion[id].clasificacion_equipo){
						var equiporoot1 = admin.database(clasificacion_app).ref('clasificacion_laliga/'+key);
						equiporoot1.update({"clasificacion_posicion":clasificacion[id].clasificacion_posicion, 
							"clasificacion_puntos":clasificacion[id].clasificacion_puntos,
							"clasificacion_partidos_jugados":clasificacion[id].clasificacion_partidos_jugados,
							"clasificacion_ganados":clasificacion[id].clasificacion_ganados,
							"clasificacion_empatados":clasificacion[id].clasificacion_empatados,
							"clasificacion_perdidos":clasificacion[id].clasificacion_perdidos,
							"clasificacion_goles_favor":clasificacion[id].clasificacion_goles_favor,
							"clasificacion_goles_contra":clasificacion[id].clasificacion_goles_contra});
					}
				}

			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 50000);


	/*
	
	setTimeout(() => {   
		for (var id=0;id<clasificacion.length;id++){
			var nuewPostKey=admin.database(otherApp).ref('clasificacion').push().key;
			admin.database(otherApp).ref('clasificacion/'+nuewPostKey).set({
				clasificacion_temporada:clasificacion[id].clasificacion_temporada,
				clasificacion_jornada:clasificacion[id].clasificacion_jornada,
				clasificacion_posicion:clasificacion[id].clasificacion_posicion,
				clasificacion_equipo:clasificacion[id].clasificacion_equipo,
				clasificacion_puntos:clasificacion[id].clasificacion_puntos,
				clasificacion_partidos_jugados:clasificacion[id].clasificacion_partidos_jugados,
				clasificacion_ganados:clasificacion[id].clasificacion_ganados,
				clasificacion_empatados:clasificacion[id].clasificacion_empatados,
				clasificacion_perdidos:clasificacion[id].clasificacion_perdidos,
				clasificacion_goles_favor:clasificacion[id].clasificacion_goles_favor,
				clasificacion_goles_contra:clasificacion[id].clasificacion_goles_contra
			});
		}
	}, 20000);

	*/
});


exports.Plantilla=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i=getJornadaLaLiga();
	const rp = require('request-promise');
	const cheerio=require('cheerio');
	const axios=require('axios');
	const fs = require('fs');
	const urls_plantilla=['https://www.resultados-futbol.com/plantilla/Real-Madrid', 'https://www.resultados-futbol.com/plantilla/Barcelona',
	'https://www.resultados-futbol.com/plantilla/Getafe', 'https://www.resultados-futbol.com/plantilla/Atletico-Madrid',
	'https://www.resultados-futbol.com/plantilla/Sevilla','https://www.resultados-futbol.com/plantilla/Real-Sociedad',
	'https://www.resultados-futbol.com/plantilla/Valencia-Cf','https://www.resultados-futbol.com/plantilla/Villarreal',
	'https://www.resultados-futbol.com/plantilla/Athletic-Bilbao','https://www.resultados-futbol.com/plantilla/Granada',
	'https://www.resultados-futbol.com/plantilla/Levante','https://www.resultados-futbol.com/plantilla/Osasuna',
	'https://www.resultados-futbol.com/plantilla/Betis','https://www.resultados-futbol.com/plantilla/Alaves',
	'https://www.resultados-futbol.com/plantilla/Valladolid','https://www.resultados-futbol.com/plantilla/Eibar',
	'https://www.resultados-futbol.com/plantilla/Celta','https://www.resultados-futbol.com/plantilla/Mallorca',
	'https://www.resultados-futbol.com/plantilla/Leganes','https://www.resultados-futbol.com/plantilla/Espanyol'];

	const plantilla=[];
	const plantillas_descargadas=[''];

	for (const a in urls_plantilla){

		var url_actual=urls_plantilla[a];

		axios(url_actual)
			.then(response=>{
				setTimeout(()=>{
					plantillas_descargadas.push(urls_plantilla[a]);
					var html=response.data;
					var $ = cheerio.load(html);
					var equipo=$('#titlehc .name h1').text();
					//console.log(equipo);
					if (equipo==='Atlético')
						equipo='Atlético Madrid'
					if (equipo === 'Athletic')
						equipo='Athletic Bilbao'
					if (equipo === 'Real')
						equipo ='Real Valladolid'
					if (equipo === 'Sociedad')
						equipo='Real Sociedad'
					if (equipo === 'R. Sociedad')
						equipo='Real Sociedad'
					if (equipo === 'Celta')
						equipo = 'Celta de Vigo'
					console.log(equipo);
					var plant = $('.sdata_table tbody > tr');
					//console.log(plant.text());
					
					var puesto="";
					plant.each(function(){
						if($(this).find('.first-child .axis').text()==="Portero"||
							$(this).find('.first-child .axis').text()==="Defensa" ||
							$(this).find('.first-child .axis').text()==="Centrocampista"||
							$(this).find('.first-child .axis').text()==="Delantero"){
							puesto=$(this).find('.first-child .axis').text();
						}else{
							var numero=$(this).find('.num').text();
							var foto=$(this).find('.sdata_player_img img').attr('src');
							var nombre=$(this).find('.sdata_player_name a span').text();
							var edad=$(this).find('.birthdate').text();
							var pais=$(this).find('.ori img').attr('src');
							var datos=$(this).find('.dat').text();
							var altura=datos.substr(0,3);
							var peso=datos.substr(3,2);
							var goles=datos.substr(5,1);
							var rojas=datos.substr(6,1);
							var amarillas=datos.substr(7,1);

							if(goles==="-"){
								goles="0";
							}
							if (rojas==="-"){
								rojas="0";
							}
							if(amarillas==="-"){
								amarillas="0";
							}
							
							//console.log(jor+" "+local+" "+resultado+" "+visitante)

							plantilla.push({
								plantilla_temporada:"Temporada2020",
								plantilla_equipo:equipo,
								plantilla_dorsal:numero,
								plantilla_foto:foto,
								plantilla_name:nombre,
								plantilla_posicion:puesto,
								plantilla_edad:edad,
								plantilla_pais:pais,
								plantilla_altura:altura,
								plantilla_peso:peso,
								plantilla_goles:goles,
								plantilla_rojas:rojas,
								plantilla_amarillas:amarillas,			
							});

						}

						return true;
						//console.log("entra");
					});
				},2000);
				return true;
			})
			.catch(console.error);
	}


	

	setTimeout(() => {   

		plantillas_por_descargar=[];

		for (var z=0;z<urls_plantilla.length;z++){
			if (plantillas_descargadas.includes(urls_plantilla[z])){
				//nada
			}else{
				plantillas_por_descargar.push(urls_plantilla[z]);
				
			}
		}

		for (const a in plantillas_por_descargar){

			var url_actual=plantillas_por_descargar[a];

			axios(url_actual)
				.then(response=>{
					setTimeout(()=>{
						//plantillas_descargadas.push(urls_plantilla[a]);
						var html=response.data;
						var $ = cheerio.load(html);
						var equipo=$('#titlehc .name h1').text();
						//console.log(equipo);
						if (equipo==='Atlético')
							equipo='Atlético Madrid'
						if (equipo === 'Athletic')
							equipo='Athletic Bilbao'
						if (equipo === 'Real')
							equipo ='Real Valladolid'
						if (equipo === 'Sociedad')
							equipo='Real Sociedad'
						if (equipo === 'R. Sociedad')
							equipo='Real Sociedad'
						if (equipo === 'Celta')
							equipo = 'Celta de Vigo'
						console.log(equipo);
						var plant = $('.sdata_table tbody > tr');
						//console.log(plant.text());
						
						var puesto="";
						plant.each(function(){
							if($(this).find('.first-child .axis').text()==="Portero"||
								$(this).find('.first-child .axis').text()==="Defensa" ||
								$(this).find('.first-child .axis').text()==="Centrocampista"||
								$(this).find('.first-child .axis').text()==="Delantero"){
								puesto=$(this).find('.first-child .axis').text();
							}else{
								var numero=$(this).find('.num').text();
								var foto=$(this).find('.sdata_player_img img').attr('src');
								var nombre=$(this).find('.sdata_player_name a span').text();
								var edad=$(this).find('.birthdate').text();
								var pais=$(this).find('.ori img').attr('src');
								var datos=$(this).find('.dat').text();
								var altura=datos.substr(0,3);
								var peso=datos.substr(3,2);
								var goles=datos.substr(5,1);
								var rojas=datos.substr(6,1);
								var amarillas=datos.substr(7,1);

								if(goles==="-"){
									goles="0";
								}
								if (rojas==="-"){
									rojas="0";
								}
								if(amarillas==="-"){
									amarillas="0";
								}
								
								//console.log(jor+" "+local+" "+resultado+" "+visitante)

								plantilla.push({
									plantilla_temporada:"Temporada2020",
									plantilla_equipo:equipo,
									plantilla_dorsal:numero,
									plantilla_foto:foto,
									plantilla_name:nombre,
									plantilla_posicion:puesto,
									plantilla_edad:edad,
									plantilla_pais:pais,
									plantilla_altura:altura,
									plantilla_peso:peso,
									plantilla_goles:goles,
									plantilla_rojas:rojas,
									plantilla_amarillas:amarillas,			
								});

							}

							return true;
							//console.log("entra");
						});
					},2000);
					return true;
				})
				.catch(console.error);
		}
		
	}, 60000);


	setTimeout(() => {   

		var plantilla="";
		var plantillaroot = admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020');
		plantillaroot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<plantilla.length;id++){
					if (childData.plantilla_equipo===plantilla[id].plantilla_equipo && 
						childData.plantilla_name===plantilla[id].plantilla_name &&
						childData.plantilla_temporada===plantilla[id].plantilla_temporada){
						var plantillaroot1 = admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020/'+key);
						equiporoot1.update({"plantilla_goles":plantilla[id].plantilla_goles, 
							"plantilla_rojas":plantilla[id].plantilla_rojas,
							"plantilla_amarillas":plantilla[id].plantilla_amarillas,
							"plantilla_edad":plantilla[id].plantilla_edad,
							"plantilla_dorsal":plantilla[id].plantilla_dorsal});
					}
				}
			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 100000);


/*
	
	setTimeout(() => {   
		for (var id=0;id<plantilla.length;id++){
			//console.log(plantilla[id].plantilla_equipo);
			var nuewPostKey=admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020').push().key;
			admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020/'+nuewPostKey).set({
				plantilla_temporada:plantilla[id].plantilla_temporada,
				plantilla_equipo:plantilla[id].plantilla_equipo,
				plantilla_dorsal:plantilla[id].plantilla_dorsal,
				plantilla_foto:plantilla[id].plantilla_foto,
				plantilla_name:plantilla[id].plantilla_name,
				plantilla_posicion:plantilla[id].plantilla_posicion,
				plantilla_edad:plantilla[id].plantilla_edad,
				plantilla_pais:plantilla[id].plantilla_pais,
				plantilla_altura:plantilla[id].plantilla_altura,
				plantilla_peso:plantilla[id].plantilla_peso,
				plantilla_goles:plantilla[id].plantilla_goles,
				plantilla_rojas:plantilla[id].plantilla_rojas,
				plantilla_amarillas:plantilla[id].plantilla_amarillas
			});
		}	
	},100000);
*/	
});



/********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
***********************  PREMIER LEAGUE  ****************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************/


exports.Partido_Alineacion_ActualizaPartido_Premier=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i=getJornadaLaLiga();
	const url='https://www.resultados-futbol.com/premier2020/grupo1';
	const partidos=[];

	axios(url+'/jornada'+i)
		.then(response=>{
			var html=response.data;
			var $ = cheerio.load(html);
			var jornada = $('#tabla1 tbody > tr');
			var jor="Jornada "+i;
			

			jornada.each(function(){

				var result=$(this).attr('class').localeCompare('vevent');
				if (result===1) {
					var local=$(this).find('.equipo1 img').attr('alt');
					var foto_local=$(this).find('.equipo1 img').attr('src');
					var visitante=$(this).find('.equipo2 img').attr('alt');
					var foto_visitante=$(this).find('.equipo2 img').attr('src');
					var resultado=$(this).find('.rstd .url .clase').text();
					var fecha=$(this).find('.fecha').text();
					var fecha1=fecha.substr(9,9);

					//console.log(jor+" "+local+" "+resultado+" "+visitante)
					if (local === "Brighton")
						local="Brighton Hove A."
					if (local === "Bournemouth")
						local = "AFC Bournemouth"
					if (local === "Sheffield")
						local = "Sheffield United"
					if (local === "Crystal")
						local = "Crystal Palace"
					if (local === "Norwich")
						local = "Norwich City"
					if (local === "West")
						local = "West Bromwich A."
					if (local === "Swansea")
						local = "Swansea City"
					if (local ==="Middlesbrou")
						local="Middlesbrough"
					if (local==="Cardiff")
						local="Cardiff City"

					if (visitante === "Brighton")
						visitante="Brighton Hove A."
					if (visitante === "Bournemouth")
						visitante = "AFC Bournemouth"
					if (visitante === "Sheffield")
						visitante = "Sheffield United"
					if (visitante === "Crystal")
						visitante = "Crystal Palace"
					if (visitante === "Norwich")
						visitante = "Norwich City"
					if (visitante === "West")
						visitante = "West Bromwich A."
					if (visitante === "Swansea")
						visitante = "Swansea City"
					if (visitante ==="Middlesbrou")
						visitante="Middlesbrough"
					if (visitante==="Cardiff")
						visitante="Cardiff City"

					if (resultado === "")
						resultado="Aplazado"

					partidos.push({
						partidos_temporada:"Temporada2020",
						partidos_jornada:jor,
						partidos_foto_local:foto_local,
						partidos_equipo_local:local,
						partidos_foto_visitante:foto_visitante,
						partidos_equipo_visitante:visitante,
						partidos_resultado:resultado,
						partidos_fecha:fecha1,
					});
					//console.log("entra");

				}else{
					//console.log("no entra");
				}
				return true;
			});
			return true;
		})
		.catch(console.error);


	setTimeout(() => {   

		var partido="";
		var partidoroot = admin.database(partidos_app).ref('calendario_premier');
		partidoroot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<partidos.length;id++){
					if (childData.partidos_equipo_local===partidos[id].partidos_equipo_local && childData.partidos_equipo_visitante===partidos[id].partidos_equipo_visitante){
						var partidoroot1 = admin.database(partidos_app).ref('calendario_premier/'+key);
						partidoroot1.update({"partidos_fecha":partidos[id].partidos_fecha, "partidos_resultado":partidos[id].partidos_resultado});
					}
				}

			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 30000);

	setTimeout(() => {   
		var urls_alineacion=['Liverpool', 'Manchester-City-Fc',
							'Leicester-City-Fc', 'Chelsea-Fc',
							'Manchester-United-Fc','Wolverhampton',
							'Sheffield-United','Tottenham-Hotspur-Fc',
							'Arsenal','Burnley-Fc',
							'Crystal-Palace-Fc','Everton-Fc',
							'Newcastle-United-Fc','Southampton-Fc',
							'Brighton-Amp-Hov','West-Ham-United',
							'Watford-Fc','Afc-Bournemouth',
							'Aston-Villa-Fc','Norwich-City-Fc'];

		var urls_equipos=['Liverpool','Man. City','Leicester','Chelsea','Man. Utd','Wolves','Sheffield United','Tottenham',
'Arsenal','Burnley','Crystal Palace','Everton','Newcastle','Southampton','Brighton Hove A.','West Ham','Watford','AFC Bournemouth',
'Aston Villa','Norwich City'];

		var enlace='https://www.resultados-futbol.com/partido/';

		var alineaciones=[];

		const alineaciones_descargadas=[];
		const alineaciones_total=[];

		var longitud=partidos.length;

		for (var p=0;p<longitud;p++){

			var partido=partidos.pop();

			var local=partido.partidos_equipo_local;
			var visitante=partido.partidos_equipo_visitante;


			var indice_local;
			var indice_visitante;

			for (var x=0;x<urls_equipos.length;x++){
				if(local===urls_equipos[x]){
					indice_local=x;
				}
				if(visitante===urls_equipos[x]){
					indice_visitante=x;
				}
			}

			var enlace_final=enlace+urls_alineacion[indice_local]+"/"+urls_alineacion[indice_visitante];

			alineaciones_total.push(enlace_final);

			var temporada="Temporada2020";
			var jornada="Jornada "+i;

			//console.log(enlace_final);

			axios(enlace_final)
				.then(response=>{

					alineaciones_descargadas.push(enlace_final);

					var html=response.data;
					//console.log(html);
					var $ = cheerio.load(html);

					var alineacion_equipo_local=$('.nteam.nteam1 a').text();
					var alineacion_equipo_visitante=$('.nteam.nteam2 a').text();

					if (alineacion_equipo_local === "Brighton")
						alineacion_equipo_local="Brighton Hove A."
					if (alineacion_equipo_local === "Bournemouth")
						alineacion_equipo_local = "AFC Bournemouth"
					if (alineacion_equipo_local === "Sheffield")
						alineacion_equipo_local = "Sheffield United"
					if (alineacion_equipo_local === "Crystal")
						alineacion_equipo_local = "Crystal Palace"
					if (alineacion_equipo_local === "Norwich")
						alineacion_equipo_local = "Norwich City"
					if (alineacion_equipo_local === "West")
						alineacion_equipo_local = "West Bromwich A."
					if (alineacion_equipo_local === "Swansea")
						alineacion_equipo_local = "Swansea City"
					if (alineacion_equipo_local ==="Middlesbrou")
						alineacion_equipo_local="Middlesbrough"
					if (alineacion_equipo_local==="Cardiff")
						alineacion_equipo_local="Cardiff City"

					if (alineacion_equipo_visitante === "Brighton")
						alineacion_equipo_visitante="Brighton Hove A."
					if (alineacion_equipo_visitante === "Bournemouth")
						alineacion_equipo_visitante = "AFC Bournemouth"
					if (alineacion_equipo_visitante === "Sheffield")
						alineacion_equipo_visitante = "Sheffield United"
					if (alineacion_equipo_visitante === "Crystal")
						alineacion_equipo_visitante = "Crystal Palace"
					if (alineacion_equipo_visitante === "Norwich")
						alineacion_equipo_visitante = "Norwich City"
					if (alineacion_equipo_visitante === "West")
						alineacion_equipo_visitante = "West Bromwich A."
					if (alineacion_equipo_visitante === "Swansea")
						alineacion_equipo_visitante = "Swansea City"
					if (alineacion_equipo_visitante ==="Middlesbrou")
						alineacion_equipo_visitante="Middlesbrough"
					if (alineacion_equipo_visitante==="Cardiff")
						alineacion_equipo_visitante="Cardiff City"


					console.log(alineacion_equipo_local+" "+alineacion_equipo_visitante);

					var equipo_local = $('.team.team1 ul > li');
					var equipo_visitante= $('.team.team2 ul > li');


					var eventos=$('#listado_eventos #teams_box .contentitem > .evento');

					var lesiones_local=[];
					var lesiones_visitante=[];
					var asistencias_local=[];
					var asistencias_visitante=[];
					var rojas_local=[];
					var rojas_visitante=[];
					var amarillas_local=[];
					var amarillas_visitante=[];
					var goles_local=[];
					var goles_visitante=[];
					var amarilla_roja_local=[];
					var amarilla_roja_visitante=[];

					eventos.each(function(){
						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de "){
							var jugador=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de "){
							var jugador1=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador1);
						}

						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de falta"){
							var jugador2=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador2);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de falta"){
							var jugador3=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador3);
						}
						if($(this).find('.left.event_11') && $(this).find('.left.event_11 small').text()==="Gol de penalti"){
							var jugador4=$(this).find('.left.event_11 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador4);
						}
						if($(this).find('.right.event_11') && $(this).find('.right.event_11 small').text()==="Gol de penalti"){
							var jugador5=$(this).find('.right.event_11 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador5);
						}
						if($(this).find('.left.event_12') && $(this).find('.left.event_12 small').text()==="Gol de "){
							var jugador6=$(this).find('.left.event_12 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador6);
						}
						if($(this).find('.right.event_12') && $(this).find('.right.event_12 small').text()==="Gol de "){
							var jugador7=$(this).find('.right.event_12 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador7);
						}

						if($(this).find('.left.event_8') && $(this).find('.left.event_8 small').text()==="T. Amarilla"){
							//console.log("entra amarilla");
							var jugador8=$(this).find('.left.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_local.push(jugador8);
						}
						if($(this).find('.right.event_8') && $(this).find('.right.event_8 small').text()==="T. Amarilla"){
							var jugador9=$(this).find('.right.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_visitante.push(jugador9);
						}
						if($(this).find('.left.event_5') && $(this).find('.left.event_5 small').text()==="Asistencia"){
							//console.log("entra asistencia");
							var jugador10=$(this).find('.left.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_local.push(jugador10);
						}
						if($(this).find('.right.event_5') && $(this).find('.right.event_5 small').text()==="Asistencia"){
							var jugador11=$(this).find('.right.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_visitante.push(jugador11);
						}
						if($(this).find('.left.event_10') && $(this).find('.left.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador12=$(this).find('.left.event_10 a').text();
							amarilla_roja_local.push(jugador12);
						}
						if($(this).find('.right.event_10') && $(this).find('.right.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador13=$(this).find('.right.event_10 a').text();
							amarilla_roja_visitante.push(jugador13);
						}
						if($(this).find('.left.event_4') && $(this).find('.left.event_4 small').text()==="Lesionado"){
							//console.log("entra Lesionado");
							var jugador14=$(this).find('.left.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_local.push(jugador14);
						}
						if($(this).find('.right.event_4') && $(this).find('.right.event_4 small').text()==="Lesionado"){
							var jugador15=$(this).find('.right.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_visitante.push(jugador15);
						}
						if($(this).find('.left.event_9') && $(this).find('.left.event_9 small').text()==="Tarjeta Roja a "){
							//console.log("entra roja");
							var jugador16=$(this).find('.left.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador16);
						}
						if($(this).find('.right.event_9') && $(this).find('.right.event_9 small').text()==="Tarjeta Roja a "){
							var jugador17=$(this).find('.right.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador17);
						}
						return true;
					});
			
				
					var est=0;
					equipo_local.each(function(){
						//console.log("entra local");
						//TITULAR/SUPLENTE
						var estado;
						if(est<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est=est+1;

						var nombre=$(this).find('.align-player').text();

						//console.log(nombre+" "+alineacion_equipo_local+" "+estado);
						var amarilla="0";
						for (a in amarillas_local){
							if(nombre===amarillas_local[a]){
								amarilla="1";
							}
						}
						var gol=0;
						for (b in goles_local){
							if(nombre===goles_local[b]){
								gol=gol+1;
							}
						}
						gol=String(gol);
						var cambio1;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1=$(this).find('.align-events span.flaticon-up12').text();
							cambio=cambio1.substr(0,2);
						}else{
							cambio="";
						}
						var roja="0";
						for(a in rojas_local){
							if(nombre===rojas_local[a]){
								roja="1";
							}
						}
						var lesion="0";
						for (a in lesiones_local){
							if (nombre===lesiones_local[a]){
								lesion="1";
							}
						}
						var asistencia=0;
						for (a in asistencias_local){
							if (asistencias_local[a] === nombre)
								asistencia=asistencia+1
						}
						asistencia=String(asistencia);

						for (a in amarilla_roja_local){
							if(nombre===amarilla_roja_local[a]){
								amarilla="2";
								roja="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio,
							alineacion_estado:estado,
							alineacion_roja:roja,
							alineacion_equipo:alineacion_equipo_local,
							alineacion_lesion:lesion,
							alineacion_jugador:nombre,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla,
							alineacion_gol:gol,		
						});

						return true;

					});


					var est1=0;
					equipo_visitante.each(function(){
						//TITULAR/SUPLENTE
						var estado;
						if(est1<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est1=est1+1;

						var nombre_visitante=$(this).find('.align-player').text();
						//console.log(nombre+" "+alineacion_equipo_visitante+" "+estado);
						var amarilla_visitante="0";
						for (b in amarillas_visitante){
							if(nombre_visitante===amarillas_visitante[b]){
								amarilla_visitante="1";
							}
						}
						var gol_visitante=0;
						for (b in goles_visitante){
							if(nombre_visitante===goles_visitante[b]){
								//console.log("gol visitante encaja");
								gol_visitante=gol_visitante+1;
								//console.log(gol_visitante);
							}
						}
						gol_visitante=String(gol_visitante);
						var cambio1_visitante;
						var cambio_visitante;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1_visitante=$(this).find('.align-events span.flaticon-up12').text();
							cambio_visitante=cambio1_visitante.substr(0,2);
						}else{
							cambio_visitante="";
						}
						var roja_visitante="0";
						for(b in rojas_visitante){
							if(nombre_visitante===rojas_visitante[b]){
								roja_visitante="1";
							}
						}
						var lesion_visitante="0";
						for (b in lesiones_visitante){
							if (nombre_visitante===lesiones_visitante[b]){
								lesion_visitante="1";
							}
						}
						var asistencia_visitante=0;
						for (b in asistencias_visitante){
							if (asistencias_visitante[b] === nombre_visitante)
								asistencia_visitante=asistencia_visitante+1
						}
						asistencia_visitante=String(asistencia_visitante);

						for (b in amarilla_roja_visitante){
							if(nombre_visitante===amarilla_roja_visitante[b]){
								amarilla_visitante="2";
								roja_visitante="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia_visitante,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio_visitante,
							alineacion_estado:estado,
							alineacion_roja:roja_visitante,
							alineacion_equipo:alineacion_equipo_visitante,
							alineacion_lesion:lesion_visitante,
							alineacion_jugador:nombre_visitante,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla_visitante,
							alineacion_gol:gol_visitante,		
						});
						return true;

					});
					return true;
				})
				.catch(console.error);

		}

		setTimeout(() => {   

			alineaciones_por_descargar=[];

			for (var z=0;z<alineaciones_total.length;z++){
				if (alineaciones_descargadas.includes(alineaciones_total[z])){
					//nada
				}else{
					alineaciones_por_descargar.push(alineaciones_total[z]);
					
				}
			}

			for (var m in alineaciones_por_descargar){
				var url_actual_alineacion=alineaciones_por_descargar[m];

				axios(url_actual_alineacion)
				.then(response=>{

					alineaciones_descargadas.push(enlace_final);

					var html=response.data;
					//console.log(html);
					var $ = cheerio.load(html);

					var alineacion_equipo_local=$('.nteam.nteam1 a').text();
					var alineacion_equipo_visitante=$('.nteam.nteam2 a').text();

					
					if (alineacion_equipo_local === "Brighton")
						alineacion_equipo_local="Brighton Hove A."
					if (alineacion_equipo_local === "Bournemouth")
						alineacion_equipo_local = "AFC Bournemouth"
					if (alineacion_equipo_local === "Sheffield")
						alineacion_equipo_local = "Sheffield United"
					if (alineacion_equipo_local === "Crystal")
						alineacion_equipo_local = "Crystal Palace"
					if (alineacion_equipo_local === "Norwich")
						alineacion_equipo_local = "Norwich City"
					if (alineacion_equipo_local === "West")
						alineacion_equipo_local = "West Bromwich A."
					if (alineacion_equipo_local === "Swansea")
						alineacion_equipo_local = "Swansea City"
					if (alineacion_equipo_local ==="Middlesbrou")
						alineacion_equipo_local="Middlesbrough"
					if (alineacion_equipo_local==="Cardiff")
						alineacion_equipo_local="Cardiff City"

					if (alineacion_equipo_visitante === "Brighton")
						alineacion_equipo_visitante="Brighton Hove A."
					if (alineacion_equipo_visitante === "Bournemouth")
						alineacion_equipo_visitante = "AFC Bournemouth"
					if (alineacion_equipo_visitante === "Sheffield")
						alineacion_equipo_visitante = "Sheffield United"
					if (alineacion_equipo_visitante === "Crystal")
						alineacion_equipo_visitante = "Crystal Palace"
					if (alineacion_equipo_visitante === "Norwich")
						alineacion_equipo_visitante = "Norwich City"
					if (alineacion_equipo_visitante === "West")
						alineacion_equipo_visitante = "West Bromwich A."
					if (alineacion_equipo_visitante === "Swansea")
						alineacion_equipo_visitante = "Swansea City"
					if (alineacion_equipo_visitante ==="Middlesbrou")
						alineacion_equipo_visitante="Middlesbrough"
					if (alineacion_equipo_visitante==="Cardiff")
						alineacion_equipo_visitante="Cardiff City"



					console.log(alineacion_equipo_local+" "+alineacion_equipo_visitante);

					var equipo_local = $('.team.team1 ul > li');
					var equipo_visitante= $('.team.team2 ul > li');


					var eventos=$('#listado_eventos #teams_box .contentitem > .evento');

					var lesiones_local=[];
					var lesiones_visitante=[];
					var asistencias_local=[];
					var asistencias_visitante=[];
					var rojas_local=[];
					var rojas_visitante=[];
					var amarillas_local=[];
					var amarillas_visitante=[];
					var goles_local=[];
					var goles_visitante=[];
					var amarilla_roja_local=[];
					var amarilla_roja_visitante=[];

					eventos.each(function(){
						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de "){
							var jugador=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de "){
							var jugador1=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador1);
						}

						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de falta"){
							var jugador2=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador2);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de falta"){
							var jugador3=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador3);
						}
						if($(this).find('.left.event_11') && $(this).find('.left.event_11 small').text()==="Gol de penalti"){
							var jugador4=$(this).find('.left.event_11 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador4);
						}
						if($(this).find('.right.event_11') && $(this).find('.right.event_11 small').text()==="Gol de penalti"){
							var jugador5=$(this).find('.right.event_11 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador5);
						}
						if($(this).find('.left.event_12') && $(this).find('.left.event_12 small').text()==="Gol de "){
							var jugador6=$(this).find('.left.event_12 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador6);
						}
						if($(this).find('.right.event_12') && $(this).find('.right.event_12 small').text()==="Gol de "){
							var jugador7=$(this).find('.right.event_12 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador7);
						}

						if($(this).find('.left.event_8') && $(this).find('.left.event_8 small').text()==="T. Amarilla"){
							//console.log("entra amarilla");
							var jugador8=$(this).find('.left.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_local.push(jugador8);
						}
						if($(this).find('.right.event_8') && $(this).find('.right.event_8 small').text()==="T. Amarilla"){
							var jugador9=$(this).find('.right.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_visitante.push(jugador9);
						}
						if($(this).find('.left.event_5') && $(this).find('.left.event_5 small').text()==="Asistencia"){
							//console.log("entra asistencia");
							var jugador10=$(this).find('.left.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_local.push(jugador10);
						}
						if($(this).find('.right.event_5') && $(this).find('.right.event_5 small').text()==="Asistencia"){
							var jugador11=$(this).find('.right.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_visitante.push(jugador11);
						}
						if($(this).find('.left.event_10') && $(this).find('.left.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador12=$(this).find('.left.event_10 a').text();
							amarilla_roja_local.push(jugador12);
						}
						if($(this).find('.right.event_10') && $(this).find('.right.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador13=$(this).find('.right.event_10 a').text();
							amarilla_roja_visitante.push(jugador13);
						}
						if($(this).find('.left.event_4') && $(this).find('.left.event_4 small').text()==="Lesionado"){
							//console.log("entra Lesionado");
							var jugador14=$(this).find('.left.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_local.push(jugador14);
						}
						if($(this).find('.right.event_4') && $(this).find('.right.event_4 small').text()==="Lesionado"){
							var jugador15=$(this).find('.right.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_visitante.push(jugador15);
						}
						if($(this).find('.left.event_9') && $(this).find('.left.event_9 small').text()==="Tarjeta Roja a "){
							//console.log("entra roja");
							var jugador16=$(this).find('.left.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador16);
						}
						if($(this).find('.right.event_9') && $(this).find('.right.event_9 small').text()==="Tarjeta Roja a "){
							var jugador17=$(this).find('.right.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador17);
						}
						return true;
					});
			
				
					var est=0;
					equipo_local.each(function(){
						//console.log("entra local");
						//TITULAR/SUPLENTE
						var estado;
						if(est<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est=est+1;

						var nombre=$(this).find('.align-player').text();

						//console.log(nombre+" "+alineacion_equipo_local+" "+estado);
						var amarilla="0";
						for (a in amarillas_local){
							if(nombre===amarillas_local[a]){
								amarilla="1";
							}
						}
						var gol=0;
						for (b in goles_local){
							if(nombre===goles_local[b]){
								gol=gol+1;
							}
						}
						gol=String(gol);
						var cambio1;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1=$(this).find('.align-events span.flaticon-up12').text();
							cambio=cambio1.substr(0,2);
						}else{
							cambio="";
						}
						var roja="0";
						for(a in rojas_local){
							if(nombre===rojas_local[a]){
								roja="1";
							}
						}
						var lesion="0";
						for (a in lesiones_local){
							if (nombre===lesiones_local[a]){
								lesion="1";
							}
						}
						var asistencia=0;
						for (a in asistencias_local){
							if (asistencias_local[a] === nombre)
								asistencia=asistencia+1
						}
						asistencia=String(asistencia);

						for (a in amarilla_roja_local){
							if(nombre===amarilla_roja_local[a]){
								amarilla="2";
								roja="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio,
							alineacion_estado:estado,
							alineacion_roja:roja,
							alineacion_equipo:alineacion_equipo_local,
							alineacion_lesion:lesion,
							alineacion_jugador:nombre,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla,
							alineacion_gol:gol,		
						});

						return true;

					});


					var est1=0;
					equipo_visitante.each(function(){
						//TITULAR/SUPLENTE
						var estado;
						if(est1<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est1=est1+1;

						var nombre_visitante=$(this).find('.align-player').text();
						//console.log(nombre+" "+alineacion_equipo_visitante+" "+estado);
						var amarilla_visitante="0";
						for (b in amarillas_visitante){
							if(nombre_visitante===amarillas_visitante[b]){
								amarilla_visitante="1";
							}
						}
						var gol_visitante=0;
						for (b in goles_visitante){
							if(nombre_visitante===goles_visitante[b]){
								//console.log("gol visitante encaja");
								gol_visitante=gol_visitante+1;
								//console.log(gol_visitante);
							}
						}
						gol_visitante=String(gol_visitante);
						var cambio1_visitante;
						var cambio_visitante;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1_visitante=$(this).find('.align-events span.flaticon-up12').text();
							cambio_visitante=cambio1_visitante.substr(0,2);
						}else{
							cambio_visitante="";
						}
						var roja_visitante="0";
						for(b in rojas_visitante){
							if(nombre_visitante===rojas_visitante[b]){
								roja_visitante="1";
							}
						}
						var lesion_visitante="0";
						for (b in lesiones_visitante){
							if (nombre_visitante===lesiones_visitante[b]){
								lesion_visitante="1";
							}
						}
						var asistencia_visitante=0;
						for (b in asistencias_visitante){
							if (asistencias_visitante[b] === nombre_visitante)
								asistencia_visitante=asistencia_visitante+1
						}
						asistencia_visitante=String(asistencia_visitante);

						for (b in amarilla_roja_visitante){
							if(nombre_visitante===amarilla_roja_visitante[b]){
								amarilla_visitante="2";
								roja_visitante="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia_visitante,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio_visitante,
							alineacion_estado:estado,
							alineacion_roja:roja_visitante,
							alineacion_equipo:alineacion_equipo_visitante,
							alineacion_lesion:lesion_visitante,
							alineacion_jugador:nombre_visitante,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla_visitante,
							alineacion_gol:gol_visitante,		
						});
						return true;

					});
					return true;
				})
				.catch(console.error);
			}

		}, 90000);


		
		setTimeout(() => {
			var jornada_equipo=[];

			var alineacionroot = admin.database(alineacion_app).ref('alineacion_premier/alineacion_premier_2019_2020');
			alineacionroot.on("value",function(snapshot){
				snapshot.forEach(function(childSnapshot) {
					var key = childSnapshot.key;
					var childData = childSnapshot.val();
					jornada_equipo.push({
							alineacion_asistencia:childData.alineacion_asistencia,
							alineacion_temporada:childData.alineacion_temporada,
							alineacion_cambio:childData.alineacion_cambio,
							alineacion_estado:childData.alineacion_estado,
							alineacion_roja:childData.alineacion_roja,
							alineacion_equipo:childData.alineacion_equipo,
							alineacion_lesion:childData.alineacion_lesion,
							alineacion_jugador:childData.alineacion_jugador,
							alineacion_jornada:childData.alineacion_jornada,
							alineacion_amarilla:childData.alineacion_amarilla,
							alineacion_gol:childData.alineacion_gol		
						});
				});
			}, function(errorObject){
				console.log("Error leyendo la jornada "+errorObject.code);
			});

			setTimeout(()=>{
				for (var i=0;i<alineaciones.length;i++){
					if(!jornada_equipo.includes(alineaciones[i])){
						var nuewPostKey=admin.database(alineacion_app).ref('alineacion_premier/alineacion_premier_2019_2020').push().key;
						admin.database(alineacion_app).ref('alineacion_premier/alineacion_premier_2019_2020/'+nuewPostKey).set({
							alineacion_asistencia:alineaciones[i].alineacion_asistencia,
							alineacion_temporada:alineaciones[i].alineacion_temporada,
							alineacion_cambio:alineaciones[i].alineacion_cambio,
							alineacion_estado:alineaciones[i].alineacion_estado,
							alineacion_roja:alineaciones[i].alineacion_roja,
							alineacion_equipo:alineaciones[i].alineacion_equipo,
							alineacion_lesion:alineaciones[i].alineacion_lesion,
							alineacion_jugador:alineaciones[i].alineacion_jugador,
							alineacion_jornada:alineaciones[i].alineacion_jornada,
							alineacion_amarilla:alineaciones[i].alineacion_amarilla,
							alineacion_gol:alineaciones[i].alineacion_gol,		
						});
					}
				}
			},200000);
		}, 150000);

	

	}, 30000);
});

exports.ClasificacionActualiza_1_Premier=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i;
	var jornadaroot1 = admin.database(jornada_app).ref('premier/value');
	jornadaroot1.on("value",function(snapshot){
		i = snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
	const url_clasificacion='https://www.resultados-futbol.com/premier2020/grupo1/jornada'
	const clasificacion=[];

	setTimeout(() => {   

		axios(url_clasificacion+i)
			.then(response=>{
				var html=response.data;
				var $ = cheerio.load(html);
				var clasif = $('#tabla2 tbody > tr');
				var jor="Jornada "+i;
				

				clasif.each(function(){

					var equipo=$(this).find('a').text();
					var puntos=$(this).find('.pts').text();
					var posicion=$(this).find('th').text();
					var pjugados=$(this).find('.pj').text();
					var ganados=$(this).find('.win').text();
					var empatados=$(this).find('.draw').text();
					var perdidos=$(this).find('.lose').text();
					var gfavor=$(this).find('.f').text();
					var gcontra=$(this).find('.c').text();
					//console.log(jor+" "+local+" "+resultado+" "+visitante)

					clasificacion.push({
						clasificacion_temporada:"Temporada2020",
						clasificacion_jornada:jor,
						clasificacion_posicion:parseInt(posicion),
						clasificacion_equipo:equipo,
						clasificacion_puntos:parseInt(puntos),
						clasificacion_partidos_jugados:parseInt(pjugados),
						clasificacion_ganados:parseInt(ganados),
						clasificacion_empatados:parseInt(empatados),
						clasificacion_perdidos:parseInt(perdidos),
						clasificacion_goles_favor:parseInt(gfavor),
						clasificacion_goles_contra:parseInt(gcontra),
					});
					//console.log("entra");
					return true;
					
				});
				return true;
			})
			.catch(console.error);
	}, 20000);

	setTimeout(() => {   

		var equipo="";
		var equiporoot = admin.database(clasificacion_app).ref('clasificacion_premier');
		equiporoot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<clasificacion.length;id++){
					if (childData.clasificacion_jornada===clasificacion[id].clasificacion_jornada && 
						childData.clasificacion_temporada===clasificacion[id].clasificacion_temporada &&
						childData.clasificacion_equipo===clasificacion[id].clasificacion_equipo){
						var equiporoot1 = admin.database(clasificacion_app).ref('clasificacion_premier/'+key);
						equiporoot1.update({"clasificacion_posicion":clasificacion[id].clasificacion_posicion, 
							"clasificacion_puntos":clasificacion[id].clasificacion_puntos,
							"clasificacion_partidos_jugados":clasificacion[id].clasificacion_partidos_jugados,
							"clasificacion_ganados":clasificacion[id].clasificacion_ganados,
							"clasificacion_empatados":clasificacion[id].clasificacion_empatados,
							"clasificacion_perdidos":clasificacion[id].clasificacion_perdidos,
							"clasificacion_goles_favor":clasificacion[id].clasificacion_goles_favor,
							"clasificacion_goles_contra":clasificacion[id].clasificacion_goles_contra});
					}
				}

			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 50000);


	/*
	
	setTimeout(() => {   
		for (var id=0;id<clasificacion.length;id++){
			var nuewPostKey=admin.database(otherApp).ref('clasificacion').push().key;
			admin.database(otherApp).ref('clasificacion/'+nuewPostKey).set({
				clasificacion_temporada:clasificacion[id].clasificacion_temporada,
				clasificacion_jornada:clasificacion[id].clasificacion_jornada,
				clasificacion_posicion:clasificacion[id].clasificacion_posicion,
				clasificacion_equipo:clasificacion[id].clasificacion_equipo,
				clasificacion_puntos:clasificacion[id].clasificacion_puntos,
				clasificacion_partidos_jugados:clasificacion[id].clasificacion_partidos_jugados,
				clasificacion_ganados:clasificacion[id].clasificacion_ganados,
				clasificacion_empatados:clasificacion[id].clasificacion_empatados,
				clasificacion_perdidos:clasificacion[id].clasificacion_perdidos,
				clasificacion_goles_favor:clasificacion[id].clasificacion_goles_favor,
				clasificacion_goles_contra:clasificacion[id].clasificacion_goles_contra
			});
		}
	}, 20000);

	*/
});


exports.Plantilla_Premier=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i=getJornadaLaLiga();
	const rp = require('request-promise');
	const cheerio=require('cheerio');
	const axios=require('axios');
	const fs = require('fs');
	const urls_plantilla=['https://www.resultados-futbol.com/plantilla/Liverpool', 'https://www.resultados-futbol.com/plantilla/Manchester-City-Fc',
'https://www.resultados-futbol.com/plantilla/Leicester-City-Fc', 'https://www.resultados-futbol.com/plantilla/Chelsea-Fc',
'https://www.resultados-futbol.com/plantilla/Manchester-United-Fc','https://www.resultados-futbol.com/plantilla/Wolverhampton',
'https://www.resultados-futbol.com/plantilla/Sheffield-United','https://www.resultados-futbol.com/plantilla/Tottenham-Hotspur-Fc',
'https://www.resultados-futbol.com/plantilla/Arsenal','https://www.resultados-futbol.com/plantilla/Burnley-Fc',
'https://www.resultados-futbol.com/plantilla/Crystal-Palace-Fc','https://www.resultados-futbol.com/plantilla/Everton-Fc',
'https://www.resultados-futbol.com/plantilla/Newcastle-United-Fc','https://www.resultados-futbol.com/plantilla/Southampton-Fc',
'https://www.resultados-futbol.com/plantilla/Brighton-Amp-Hov','https://www.resultados-futbol.com/plantilla/West-Ham-United',
'https://www.resultados-futbol.com/plantilla/Watford-Fc','https://www.resultados-futbol.com/plantilla/Afc-Bournemouth',
'https://www.resultados-futbol.com/plantilla/Aston-Villa-Fc','https://www.resultados-futbol.com/plantilla/Norwich-City-Fc'];

	const plantilla=[];
	const plantillas_descargadas=[''];

	for (const a in urls_plantilla){

		var url_actual=urls_plantilla[a];

		axios(url_actual)
			.then(response=>{
				setTimeout(()=>{
					plantillas_descargadas.push(urls_plantilla[a]);
					var html=response.data;
					var $ = cheerio.load(html);
					var equipo=$('#titlehc .name h1').text();
					//console.log(equipo);
					console.log(equipo);
					var plant = $('.sdata_table tbody > tr');
					//console.log(plant.text());
					
					var puesto="";
					plant.each(function(){
						if($(this).find('.first-child .axis').text()==="Portero"||
							$(this).find('.first-child .axis').text()==="Defensa" ||
							$(this).find('.first-child .axis').text()==="Centrocampista"||
							$(this).find('.first-child .axis').text()==="Delantero"){
							puesto=$(this).find('.first-child .axis').text();
						}else{
							var numero=$(this).find('.num').text();
							var foto=$(this).find('.sdata_player_img img').attr('src');
							var nombre=$(this).find('.sdata_player_name a span').text();
							var edad=$(this).find('.birthdate').text();
							var pais=$(this).find('.ori img').attr('src');
							var datos=$(this).find('.dat').text();
							var altura=datos.substr(0,3);
							var peso=datos.substr(3,2);
							var goles=datos.substr(5,1);
							var rojas=datos.substr(6,1);
							var amarillas=datos.substr(7,1);

							if(goles==="-"){
								goles="0";
							}
							if (rojas==="-"){
								rojas="0";
							}
							if(amarillas==="-"){
								amarillas="0";
							}
							
							//console.log(jor+" "+local+" "+resultado+" "+visitante)

							plantilla.push({
								plantilla_temporada:"Temporada2020",
								plantilla_equipo:equipo,
								plantilla_dorsal:numero,
								plantilla_foto:foto,
								plantilla_name:nombre,
								plantilla_posicion:puesto,
								plantilla_edad:edad,
								plantilla_pais:pais,
								plantilla_altura:altura,
								plantilla_peso:peso,
								plantilla_goles:goles,
								plantilla_rojas:rojas,
								plantilla_amarillas:amarillas,			
							});

						}

						return true;
						//console.log("entra");
					});
				},2000);
				return true;
			})
			.catch(console.error);
	}


	

	setTimeout(() => {   

		plantillas_por_descargar=[];

		for (var z=0;z<urls_plantilla.length;z++){
			if (plantillas_descargadas.includes(urls_plantilla[z])){
				//nada
			}else{
				plantillas_por_descargar.push(urls_plantilla[z]);
				
			}
		}

		for (const a in plantillas_por_descargar){

			var url_actual=plantillas_por_descargar[a];

			axios(url_actual)
				.then(response=>{
					setTimeout(()=>{
						//plantillas_descargadas.push(urls_plantilla[a]);
						var html=response.data;
						var $ = cheerio.load(html);
						var equipo=$('#titlehc .name h1').text();
						//console.log(equipo);
						console.log(equipo);
						var plant = $('.sdata_table tbody > tr');
						//console.log(plant.text());
						
						var puesto="";
						plant.each(function(){
							if($(this).find('.first-child .axis').text()==="Portero"||
								$(this).find('.first-child .axis').text()==="Defensa" ||
								$(this).find('.first-child .axis').text()==="Centrocampista"||
								$(this).find('.first-child .axis').text()==="Delantero"){
								puesto=$(this).find('.first-child .axis').text();
							}else{
								var numero=$(this).find('.num').text();
								var foto=$(this).find('.sdata_player_img img').attr('src');
								var nombre=$(this).find('.sdata_player_name a span').text();
								var edad=$(this).find('.birthdate').text();
								var pais=$(this).find('.ori img').attr('src');
								var datos=$(this).find('.dat').text();
								var altura=datos.substr(0,3);
								var peso=datos.substr(3,2);
								var goles=datos.substr(5,1);
								var rojas=datos.substr(6,1);
								var amarillas=datos.substr(7,1);

								if(goles==="-"){
									goles="0";
								}
								if (rojas==="-"){
									rojas="0";
								}
								if(amarillas==="-"){
									amarillas="0";
								}
								
								//console.log(jor+" "+local+" "+resultado+" "+visitante)

								plantilla.push({
									plantilla_temporada:"Temporada2020",
									plantilla_equipo:equipo,
									plantilla_dorsal:numero,
									plantilla_foto:foto,
									plantilla_name:nombre,
									plantilla_posicion:puesto,
									plantilla_edad:edad,
									plantilla_pais:pais,
									plantilla_altura:altura,
									plantilla_peso:peso,
									plantilla_goles:goles,
									plantilla_rojas:rojas,
									plantilla_amarillas:amarillas,			
								});

							}

							return true;
							//console.log("entra");
						});
					},2000);
					return true;
				})
				.catch(console.error);
		}
		
	}, 60000);


	setTimeout(() => {   

		var plantilla="";
		var plantillaroot = admin.database(plantilla_app).ref('plantilla_premier/plantilla_premier_2019_2020');
		plantillaroot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<plantilla.length;id++){
					if (childData.plantilla_equipo===plantilla[id].plantilla_equipo && 
						childData.plantilla_name===plantilla[id].plantilla_name &&
						childData.plantilla_temporada===plantilla[id].plantilla_temporada){
						var plantillaroot1 = admin.database(plantilla_app).ref('plantilla_premier/plantilla_premier_2019_2020/'+key);
						equiporoot1.update({"plantilla_goles":plantilla[id].plantilla_goles, 
							"plantilla_rojas":plantilla[id].plantilla_rojas,
							"plantilla_amarillas":plantilla[id].plantilla_amarillas,
							"plantilla_edad":plantilla[id].plantilla_edad,
							"plantilla_dorsal":plantilla[id].plantilla_dorsal});
					}
				}
			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 100000);


/*
	
	setTimeout(() => {   
		for (var id=0;id<plantilla.length;id++){
			//console.log(plantilla[id].plantilla_equipo);
			var nuewPostKey=admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020').push().key;
			admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020/'+nuewPostKey).set({
				plantilla_temporada:plantilla[id].plantilla_temporada,
				plantilla_equipo:plantilla[id].plantilla_equipo,
				plantilla_dorsal:plantilla[id].plantilla_dorsal,
				plantilla_foto:plantilla[id].plantilla_foto,
				plantilla_name:plantilla[id].plantilla_name,
				plantilla_posicion:plantilla[id].plantilla_posicion,
				plantilla_edad:plantilla[id].plantilla_edad,
				plantilla_pais:plantilla[id].plantilla_pais,
				plantilla_altura:plantilla[id].plantilla_altura,
				plantilla_peso:plantilla[id].plantilla_peso,
				plantilla_goles:plantilla[id].plantilla_goles,
				plantilla_rojas:plantilla[id].plantilla_rojas,
				plantilla_amarillas:plantilla[id].plantilla_amarillas
			});
		}	
	},100000);
*/	
});



/********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
***********************  BUNDESLIGA  ****************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************/


exports.Partido_Alineacion_ActualizaPartido_Bundesliga=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i=getJornadaLaLiga();
	const url='https://www.resultados-futbol.com/bundesliga2020/grupo1';
	const partidos=[];

	axios(url+'/jornada'+i)
		.then(response=>{
			var html=response.data;
			var $ = cheerio.load(html);
			var jornada = $('#tabla1 tbody > tr');
			var jor="Jornada "+i;
			

			jornada.each(function(){

				var result=$(this).attr('class').localeCompare('vevent');
				if (result===1) {
					var local=$(this).find('.equipo1 img').attr('alt');
					var foto_local=$(this).find('.equipo1 img').attr('src');
					var visitante=$(this).find('.equipo2 img').attr('alt');
					var foto_visitante=$(this).find('.equipo2 img').attr('src');
					var resultado=$(this).find('.rstd .url .clase').text();
					var fecha=$(this).find('.fecha').text();
					var fecha1=fecha.substr(9,9);

					//console.log(jor+" "+local+" "+resultado+" "+visitante)
					if (local==="Bayern")
						local="Bayern München"
					if (local === "Dortmund")
						local="B. Dortmund"
					if (local === "Augsburg")
						local="FC Augsburg"
					if (local==="Leverkusen")
						local="B. Leverkusen"
					if (local==="Monchenglad")
						local="Monchengladbach"
					if (local === "Werder")
						local="Werder Bremen"
					if (local==="Freiburg")
						local="SC Freiburg"
					if (local === "Union")
						local="Union Berlin"
					if (local==="Hannover")
						local="Hannover 96"
					if (local==="Hamburger")
						local="Hamburguer SV"
					if (local==="Inglostadt")
						local="Inglostadt 04"
					if (local==="Darmstadt")
						local="Darmstadt 98"

					if (visitante==="Bayern")
						visitante="Bayern München"
					if (visitante === "Dortmund")
						visitante="B. Dortmund"
					if (visitante === "Augsburg")
						visitante="FC Augsburg"
					if (visitante==="Leverkusen")
						visitante="B. Leverkusen"
					if (visitante==="Monchenglad")
						visitante="Monchengladbach"
					if (visitante === "Werder")
						visitante="Werder Bremen"
					if (visitante==="Freiburg")
						visitante="SC Freiburg"
					if (visitante === "Union")
						visitante="Union Berlin"
					if (visitante==="Hannover")
						visitante="Hannover 96"
					if (visitante==="Hamburger")
						visitante="Hamburguer SV"
					if (visitante==="Inglostadt")
						visitante="Inglostadt 04"
					if (visitante==="Darmstadt")
						visitante="Darmstadt 98"

					if (resultado === "")
						resultado="Aplazado"

					partidos.push({
						partidos_temporada:"Temporada2020",
						partidos_jornada:jor,
						partidos_foto_local:foto_local,
						partidos_equipo_local:local,
						partidos_foto_visitante:foto_visitante,
						partidos_equipo_visitante:visitante,
						partidos_resultado:resultado,
						partidos_fecha:fecha1,
					});
					//console.log("entra");

				}else{
					//console.log("no entra");
				}
				return true;
			});
			return true;
		})
		.catch(console.error);


	setTimeout(() => {   

		var partido="";
		var partidoroot = admin.database(partidos_app).ref('calendario_bundesliga');
		partidoroot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<partidos.length;id++){
					if (childData.partidos_equipo_local===partidos[id].partidos_equipo_local && childData.partidos_equipo_visitante===partidos[id].partidos_equipo_visitante){
						var partidoroot1 = admin.database(partidos_app).ref('calendario_bundesliga/'+key);
						partidoroot1.update({"partidos_fecha":partidos[id].partidos_fecha, "partidos_resultado":partidos[id].partidos_resultado});
					}
				}

			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 30000);

	setTimeout(() => {   
		var urls_alineacion=['Bayern-Munchen', 'Borussia-Dortmund',
								'Rb-Leipzig', 'Borussia-Monchengla',
								'Bayer-Leverkusen','Schalke-04',
								'Wolfsburg','Sc-Freiburg',
								'Tsg-1899-Hoffenheim','1-Fc-Koln',
								'1-Fc-Union-Berlin','Eintracht-Frankfurt',
								'Hertha-Bsc','Fc-Augsburg',
								'Mainz-Amat','Fortuna-Dusseldorf',
								'Werder-Bremen','Paderborn'];

		var urls_equipos=['Bayern München','B. Dortmund', 'RB Leipzig','Monchengladbach','B. Leverkusen','Schalke 04', 'Wolfsburg', 'SC Freiburg',
'Hoffenheim', 'Köln', 'Union Berlin', 'Eintracht', 'Hertha BSC', 'FC Augsburg', 'Mainz 05', 'Fortuna', 'Werder Bremen', 'Paderborn'];

		var enlace='https://www.resultados-futbol.com/partido/';

		var alineaciones=[];

		const alineaciones_descargadas=[];
		const alineaciones_total=[];

		var longitud=partidos.length;

		for (var p=0;p<longitud;p++){

			var partido=partidos.pop();

			var local=partido.partidos_equipo_local;
			var visitante=partido.partidos_equipo_visitante;


			var indice_local;
			var indice_visitante;

			for (var x=0;x<urls_equipos.length;x++){
				if(local===urls_equipos[x]){
					indice_local=x;
				}
				if(visitante===urls_equipos[x]){
					indice_visitante=x;
				}
			}

			var enlace_final=enlace+urls_alineacion[indice_local]+"/"+urls_alineacion[indice_visitante];

			alineaciones_total.push(enlace_final);

			var temporada="Temporada2020";
			var jornada="Jornada "+i;

			//console.log(enlace_final);

			axios(enlace_final)
				.then(response=>{

					alineaciones_descargadas.push(enlace_final);

					var html=response.data;
					//console.log(html);
					var $ = cheerio.load(html);

					var alineacion_equipo_local=$('.nteam.nteam1 a').text();
					var alineacion_equipo_visitante=$('.nteam.nteam2 a').text();

					if (alineacion_equipo_local==="Bayern")
						alineacion_equipo_local="Bayern München"
					if (alineacion_equipo_local === "Dortmund")
						alineacion_equipo_local="B. Dortmund"
					if (alineacion_equipo_local === "Augsburg")
						alineacion_equipo_local="FC Augsburg"
					if (alineacion_equipo_local==="Leverkusen")
						alineacion_equipo_local="B. Leverkusen"
					if (alineacion_equipo_local==="Monchenglad")
						alineacion_equipo_local="Monchengladbach"
					if (alineacion_equipo_local === "Werder")
						alineacion_equipo_local="Werder Bremen"
					if (alineacion_equipo_local==="Freiburg")
						alineacion_equipo_local="SC Freiburg"
					if (alineacion_equipo_local === "Union")
						alineacion_equipo_local="Union Berlin"
					if (alineacion_equipo_local==="Hannover")
						alineacion_equipo_local="Hannover 96"
					if (alineacion_equipo_local==="Hamburger")
						alineacion_equipo_local="Hamburguer SV"
					if (alineacion_equipo_local==="Inglostadt")
						alineacion_equipo_local="Inglostadt 04"
					if (alineacion_equipo_local==="Darmstadt")
						alineacion_equipo_local="Darmstadt 98"

					if (alineacion_equipo_visitante==="Bayern")
						alineacion_equipo_visitante="Bayern München"
					if (alineacion_equipo_visitante === "Dortmund")
						alineacion_equipo_visitante="B. Dortmund"
					if (alineacion_equipo_visitante === "Augsburg")
						alineacion_equipo_visitante="FC Augsburg"
					if (alineacion_equipo_visitante==="Leverkusen")
						alineacion_equipo_visitante="B. Leverkusen"
					if (alineacion_equipo_visitante==="Monchenglad")
						alineacion_equipo_visitante="Monchengladbach"
					if (alineacion_equipo_visitante === "Werder")
						alineacion_equipo_visitante="Werder Bremen"
					if (alineacion_equipo_visitante==="Freiburg")
						alineacion_equipo_visitante="SC Freiburg"
					if (alineacion_equipo_visitante === "Union")
						alineacion_equipo_visitante="Union Berlin"
					if (alineacion_equipo_visitante==="Hannover")
						alineacion_equipo_visitante="Hannover 96"
					if (alineacion_equipo_visitante==="Hamburger")
						alineacion_equipo_visitante="Hamburguer SV"
					if (alineacion_equipo_visitante==="Inglostadt")
						alineacion_equipo_visitante="Inglostadt 04"
					if (alineacion_equipo_visitante==="Darmstadt")
						alineacion_equipo_visitante="Darmstadt 98"


					console.log(alineacion_equipo_local+" "+alineacion_equipo_visitante);

					var equipo_local = $('.team.team1 ul > li');
					var equipo_visitante= $('.team.team2 ul > li');


					var eventos=$('#listado_eventos #teams_box .contentitem > .evento');

					var lesiones_local=[];
					var lesiones_visitante=[];
					var asistencias_local=[];
					var asistencias_visitante=[];
					var rojas_local=[];
					var rojas_visitante=[];
					var amarillas_local=[];
					var amarillas_visitante=[];
					var goles_local=[];
					var goles_visitante=[];
					var amarilla_roja_local=[];
					var amarilla_roja_visitante=[];

					eventos.each(function(){
						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de "){
							var jugador=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de "){
							var jugador1=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador1);
						}

						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de falta"){
							var jugador2=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador2);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de falta"){
							var jugador3=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador3);
						}
						if($(this).find('.left.event_11') && $(this).find('.left.event_11 small').text()==="Gol de penalti"){
							var jugador4=$(this).find('.left.event_11 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador4);
						}
						if($(this).find('.right.event_11') && $(this).find('.right.event_11 small').text()==="Gol de penalti"){
							var jugador5=$(this).find('.right.event_11 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador5);
						}
						if($(this).find('.left.event_12') && $(this).find('.left.event_12 small').text()==="Gol de "){
							var jugador6=$(this).find('.left.event_12 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador6);
						}
						if($(this).find('.right.event_12') && $(this).find('.right.event_12 small').text()==="Gol de "){
							var jugador7=$(this).find('.right.event_12 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador7);
						}

						if($(this).find('.left.event_8') && $(this).find('.left.event_8 small').text()==="T. Amarilla"){
							//console.log("entra amarilla");
							var jugador8=$(this).find('.left.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_local.push(jugador8);
						}
						if($(this).find('.right.event_8') && $(this).find('.right.event_8 small').text()==="T. Amarilla"){
							var jugador9=$(this).find('.right.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_visitante.push(jugador9);
						}
						if($(this).find('.left.event_5') && $(this).find('.left.event_5 small').text()==="Asistencia"){
							//console.log("entra asistencia");
							var jugador10=$(this).find('.left.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_local.push(jugador10);
						}
						if($(this).find('.right.event_5') && $(this).find('.right.event_5 small').text()==="Asistencia"){
							var jugador11=$(this).find('.right.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_visitante.push(jugador11);
						}
						if($(this).find('.left.event_10') && $(this).find('.left.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador12=$(this).find('.left.event_10 a').text();
							amarilla_roja_local.push(jugador12);
						}
						if($(this).find('.right.event_10') && $(this).find('.right.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador13=$(this).find('.right.event_10 a').text();
							amarilla_roja_visitante.push(jugador13);
						}
						if($(this).find('.left.event_4') && $(this).find('.left.event_4 small').text()==="Lesionado"){
							//console.log("entra Lesionado");
							var jugador14=$(this).find('.left.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_local.push(jugador14);
						}
						if($(this).find('.right.event_4') && $(this).find('.right.event_4 small').text()==="Lesionado"){
							var jugador15=$(this).find('.right.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_visitante.push(jugador15);
						}
						if($(this).find('.left.event_9') && $(this).find('.left.event_9 small').text()==="Tarjeta Roja a "){
							//console.log("entra roja");
							var jugador16=$(this).find('.left.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador16);
						}
						if($(this).find('.right.event_9') && $(this).find('.right.event_9 small').text()==="Tarjeta Roja a "){
							var jugador17=$(this).find('.right.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador17);
						}
						return true;
					});
			
				
					var est=0;
					equipo_local.each(function(){
						//console.log("entra local");
						//TITULAR/SUPLENTE
						var estado;
						if(est<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est=est+1;

						var nombre=$(this).find('.align-player').text();

						//console.log(nombre+" "+alineacion_equipo_local+" "+estado);
						var amarilla="0";
						for (a in amarillas_local){
							if(nombre===amarillas_local[a]){
								amarilla="1";
							}
						}
						var gol=0;
						for (b in goles_local){
							if(nombre===goles_local[b]){
								gol=gol+1;
							}
						}
						gol=String(gol);
						var cambio1;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1=$(this).find('.align-events span.flaticon-up12').text();
							cambio=cambio1.substr(0,2);
						}else{
							cambio="";
						}
						var roja="0";
						for(a in rojas_local){
							if(nombre===rojas_local[a]){
								roja="1";
							}
						}
						var lesion="0";
						for (a in lesiones_local){
							if (nombre===lesiones_local[a]){
								lesion="1";
							}
						}
						var asistencia=0;
						for (a in asistencias_local){
							if (asistencias_local[a] === nombre)
								asistencia=asistencia+1
						}
						asistencia=String(asistencia);

						for (a in amarilla_roja_local){
							if(nombre===amarilla_roja_local[a]){
								amarilla="2";
								roja="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio,
							alineacion_estado:estado,
							alineacion_roja:roja,
							alineacion_equipo:alineacion_equipo_local,
							alineacion_lesion:lesion,
							alineacion_jugador:nombre,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla,
							alineacion_gol:gol,		
						});

						return true;

					});


					var est1=0;
					equipo_visitante.each(function(){
						//TITULAR/SUPLENTE
						var estado;
						if(est1<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est1=est1+1;

						var nombre_visitante=$(this).find('.align-player').text();
						//console.log(nombre+" "+alineacion_equipo_visitante+" "+estado);
						var amarilla_visitante="0";
						for (b in amarillas_visitante){
							if(nombre_visitante===amarillas_visitante[b]){
								amarilla_visitante="1";
							}
						}
						var gol_visitante=0;
						for (b in goles_visitante){
							if(nombre_visitante===goles_visitante[b]){
								//console.log("gol visitante encaja");
								gol_visitante=gol_visitante+1;
								//console.log(gol_visitante);
							}
						}
						gol_visitante=String(gol_visitante);
						var cambio1_visitante;
						var cambio_visitante;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1_visitante=$(this).find('.align-events span.flaticon-up12').text();
							cambio_visitante=cambio1_visitante.substr(0,2);
						}else{
							cambio_visitante="";
						}
						var roja_visitante="0";
						for(b in rojas_visitante){
							if(nombre_visitante===rojas_visitante[b]){
								roja_visitante="1";
							}
						}
						var lesion_visitante="0";
						for (b in lesiones_visitante){
							if (nombre_visitante===lesiones_visitante[b]){
								lesion_visitante="1";
							}
						}
						var asistencia_visitante=0;
						for (b in asistencias_visitante){
							if (asistencias_visitante[b] === nombre_visitante)
								asistencia_visitante=asistencia_visitante+1
						}
						asistencia_visitante=String(asistencia_visitante);

						for (b in amarilla_roja_visitante){
							if(nombre_visitante===amarilla_roja_visitante[b]){
								amarilla_visitante="2";
								roja_visitante="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia_visitante,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio_visitante,
							alineacion_estado:estado,
							alineacion_roja:roja_visitante,
							alineacion_equipo:alineacion_equipo_visitante,
							alineacion_lesion:lesion_visitante,
							alineacion_jugador:nombre_visitante,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla_visitante,
							alineacion_gol:gol_visitante,		
						});
						return true;

					});
					return true;
				})
				.catch(console.error);

		}

		setTimeout(() => {   

			alineaciones_por_descargar=[];

			for (var z=0;z<alineaciones_total.length;z++){
				if (alineaciones_descargadas.includes(alineaciones_total[z])){
					//nada
				}else{
					alineaciones_por_descargar.push(alineaciones_total[z]);
					
				}
			}

			for (var m in alineaciones_por_descargar){
				var url_actual_alineacion=alineaciones_por_descargar[m];

				axios(url_actual_alineacion)
				.then(response=>{

					alineaciones_descargadas.push(enlace_final);

					var html=response.data;
					//console.log(html);
					var $ = cheerio.load(html);

					var alineacion_equipo_local=$('.nteam.nteam1 a').text();
					var alineacion_equipo_visitante=$('.nteam.nteam2 a').text();

					
					if (alineacion_equipo_local==="Bayern")
						alineacion_equipo_local="Bayern München"
					if (alineacion_equipo_local === "Dortmund")
						alineacion_equipo_local="B. Dortmund"
					if (alineacion_equipo_local === "Augsburg")
						alineacion_equipo_local="FC Augsburg"
					if (alineacion_equipo_local==="Leverkusen")
						alineacion_equipo_local="B. Leverkusen"
					if (alineacion_equipo_local==="Monchenglad")
						alineacion_equipo_local="Monchengladbach"
					if (alineacion_equipo_local === "Werder")
						alineacion_equipo_local="Werder Bremen"
					if (alineacion_equipo_local==="Freiburg")
						alineacion_equipo_local="SC Freiburg"
					if (alineacion_equipo_local === "Union")
						alineacion_equipo_local="Union Berlin"
					if (alineacion_equipo_local==="Hannover")
						alineacion_equipo_local="Hannover 96"
					if (alineacion_equipo_local==="Hamburger")
						alineacion_equipo_local="Hamburguer SV"
					if (alineacion_equipo_local==="Inglostadt")
						alineacion_equipo_local="Inglostadt 04"
					if (alineacion_equipo_local==="Darmstadt")
						alineacion_equipo_local="Darmstadt 98"

					if (alineacion_equipo_visitante==="Bayern")
						alineacion_equipo_visitante="Bayern München"
					if (alineacion_equipo_visitante === "Dortmund")
						alineacion_equipo_visitante="B. Dortmund"
					if (alineacion_equipo_visitante === "Augsburg")
						alineacion_equipo_visitante="FC Augsburg"
					if (alineacion_equipo_visitante==="Leverkusen")
						alineacion_equipo_visitante="B. Leverkusen"
					if (alineacion_equipo_visitante==="Monchenglad")
						alineacion_equipo_visitante="Monchengladbach"
					if (alineacion_equipo_visitante === "Werder")
						alineacion_equipo_visitante="Werder Bremen"
					if (alineacion_equipo_visitante==="Freiburg")
						alineacion_equipo_visitante="SC Freiburg"
					if (alineacion_equipo_visitante === "Union")
						alineacion_equipo_visitante="Union Berlin"
					if (alineacion_equipo_visitante==="Hannover")
						alineacion_equipo_visitante="Hannover 96"
					if (alineacion_equipo_visitante==="Hamburger")
						alineacion_equipo_visitante="Hamburguer SV"
					if (alineacion_equipo_visitante==="Inglostadt")
						alineacion_equipo_visitante="Inglostadt 04"
					if (alineacion_equipo_visitante==="Darmstadt")
						alineacion_equipo_visitante="Darmstadt 98"



					console.log(alineacion_equipo_local+" "+alineacion_equipo_visitante);

					var equipo_local = $('.team.team1 ul > li');
					var equipo_visitante= $('.team.team2 ul > li');


					var eventos=$('#listado_eventos #teams_box .contentitem > .evento');

					var lesiones_local=[];
					var lesiones_visitante=[];
					var asistencias_local=[];
					var asistencias_visitante=[];
					var rojas_local=[];
					var rojas_visitante=[];
					var amarillas_local=[];
					var amarillas_visitante=[];
					var goles_local=[];
					var goles_visitante=[];
					var amarilla_roja_local=[];
					var amarilla_roja_visitante=[];

					eventos.each(function(){
						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de "){
							var jugador=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de "){
							var jugador1=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador1);
						}

						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de falta"){
							var jugador2=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador2);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de falta"){
							var jugador3=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador3);
						}
						if($(this).find('.left.event_11') && $(this).find('.left.event_11 small').text()==="Gol de penalti"){
							var jugador4=$(this).find('.left.event_11 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador4);
						}
						if($(this).find('.right.event_11') && $(this).find('.right.event_11 small').text()==="Gol de penalti"){
							var jugador5=$(this).find('.right.event_11 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador5);
						}
						if($(this).find('.left.event_12') && $(this).find('.left.event_12 small').text()==="Gol de "){
							var jugador6=$(this).find('.left.event_12 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador6);
						}
						if($(this).find('.right.event_12') && $(this).find('.right.event_12 small').text()==="Gol de "){
							var jugador7=$(this).find('.right.event_12 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador7);
						}

						if($(this).find('.left.event_8') && $(this).find('.left.event_8 small').text()==="T. Amarilla"){
							//console.log("entra amarilla");
							var jugador8=$(this).find('.left.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_local.push(jugador8);
						}
						if($(this).find('.right.event_8') && $(this).find('.right.event_8 small').text()==="T. Amarilla"){
							var jugador9=$(this).find('.right.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_visitante.push(jugador9);
						}
						if($(this).find('.left.event_5') && $(this).find('.left.event_5 small').text()==="Asistencia"){
							//console.log("entra asistencia");
							var jugador10=$(this).find('.left.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_local.push(jugador10);
						}
						if($(this).find('.right.event_5') && $(this).find('.right.event_5 small').text()==="Asistencia"){
							var jugador11=$(this).find('.right.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_visitante.push(jugador11);
						}
						if($(this).find('.left.event_10') && $(this).find('.left.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador12=$(this).find('.left.event_10 a').text();
							amarilla_roja_local.push(jugador12);
						}
						if($(this).find('.right.event_10') && $(this).find('.right.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador13=$(this).find('.right.event_10 a').text();
							amarilla_roja_visitante.push(jugador13);
						}
						if($(this).find('.left.event_4') && $(this).find('.left.event_4 small').text()==="Lesionado"){
							//console.log("entra Lesionado");
							var jugador14=$(this).find('.left.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_local.push(jugador14);
						}
						if($(this).find('.right.event_4') && $(this).find('.right.event_4 small').text()==="Lesionado"){
							var jugador15=$(this).find('.right.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_visitante.push(jugador15);
						}
						if($(this).find('.left.event_9') && $(this).find('.left.event_9 small').text()==="Tarjeta Roja a "){
							//console.log("entra roja");
							var jugador16=$(this).find('.left.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador16);
						}
						if($(this).find('.right.event_9') && $(this).find('.right.event_9 small').text()==="Tarjeta Roja a "){
							var jugador17=$(this).find('.right.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador17);
						}
						return true;
					});
			
				
					var est=0;
					equipo_local.each(function(){
						//console.log("entra local");
						//TITULAR/SUPLENTE
						var estado;
						if(est<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est=est+1;

						var nombre=$(this).find('.align-player').text();

						//console.log(nombre+" "+alineacion_equipo_local+" "+estado);
						var amarilla="0";
						for (a in amarillas_local){
							if(nombre===amarillas_local[a]){
								amarilla="1";
							}
						}
						var gol=0;
						for (b in goles_local){
							if(nombre===goles_local[b]){
								gol=gol+1;
							}
						}
						gol=String(gol);
						var cambio1;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1=$(this).find('.align-events span.flaticon-up12').text();
							cambio=cambio1.substr(0,2);
						}else{
							cambio="";
						}
						var roja="0";
						for(a in rojas_local){
							if(nombre===rojas_local[a]){
								roja="1";
							}
						}
						var lesion="0";
						for (a in lesiones_local){
							if (nombre===lesiones_local[a]){
								lesion="1";
							}
						}
						var asistencia=0;
						for (a in asistencias_local){
							if (asistencias_local[a] === nombre)
								asistencia=asistencia+1
						}
						asistencia=String(asistencia);

						for (a in amarilla_roja_local){
							if(nombre===amarilla_roja_local[a]){
								amarilla="2";
								roja="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio,
							alineacion_estado:estado,
							alineacion_roja:roja,
							alineacion_equipo:alineacion_equipo_local,
							alineacion_lesion:lesion,
							alineacion_jugador:nombre,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla,
							alineacion_gol:gol,		
						});

						return true;

					});


					var est1=0;
					equipo_visitante.each(function(){
						//TITULAR/SUPLENTE
						var estado;
						if(est1<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est1=est1+1;

						var nombre_visitante=$(this).find('.align-player').text();
						//console.log(nombre+" "+alineacion_equipo_visitante+" "+estado);
						var amarilla_visitante="0";
						for (b in amarillas_visitante){
							if(nombre_visitante===amarillas_visitante[b]){
								amarilla_visitante="1";
							}
						}
						var gol_visitante=0;
						for (b in goles_visitante){
							if(nombre_visitante===goles_visitante[b]){
								//console.log("gol visitante encaja");
								gol_visitante=gol_visitante+1;
								//console.log(gol_visitante);
							}
						}
						gol_visitante=String(gol_visitante);
						var cambio1_visitante;
						var cambio_visitante;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1_visitante=$(this).find('.align-events span.flaticon-up12').text();
							cambio_visitante=cambio1_visitante.substr(0,2);
						}else{
							cambio_visitante="";
						}
						var roja_visitante="0";
						for(b in rojas_visitante){
							if(nombre_visitante===rojas_visitante[b]){
								roja_visitante="1";
							}
						}
						var lesion_visitante="0";
						for (b in lesiones_visitante){
							if (nombre_visitante===lesiones_visitante[b]){
								lesion_visitante="1";
							}
						}
						var asistencia_visitante=0;
						for (b in asistencias_visitante){
							if (asistencias_visitante[b] === nombre_visitante)
								asistencia_visitante=asistencia_visitante+1
						}
						asistencia_visitante=String(asistencia_visitante);

						for (b in amarilla_roja_visitante){
							if(nombre_visitante===amarilla_roja_visitante[b]){
								amarilla_visitante="2";
								roja_visitante="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia_visitante,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio_visitante,
							alineacion_estado:estado,
							alineacion_roja:roja_visitante,
							alineacion_equipo:alineacion_equipo_visitante,
							alineacion_lesion:lesion_visitante,
							alineacion_jugador:nombre_visitante,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla_visitante,
							alineacion_gol:gol_visitante,		
						});
						return true;

					});
					return true;
				})
				.catch(console.error);
			}

		}, 90000);


		
		setTimeout(() => {
			var jornada_equipo=[];

			var alineacionroot = admin.database(alineacion_app).ref('alineacion_bundesliga/alineacion_bundesliga_2019_2020');
			alineacionroot.on("value",function(snapshot){
				snapshot.forEach(function(childSnapshot) {
					var key = childSnapshot.key;
					var childData = childSnapshot.val();
					jornada_equipo.push({
							alineacion_asistencia:childData.alineacion_asistencia,
							alineacion_temporada:childData.alineacion_temporada,
							alineacion_cambio:childData.alineacion_cambio,
							alineacion_estado:childData.alineacion_estado,
							alineacion_roja:childData.alineacion_roja,
							alineacion_equipo:childData.alineacion_equipo,
							alineacion_lesion:childData.alineacion_lesion,
							alineacion_jugador:childData.alineacion_jugador,
							alineacion_jornada:childData.alineacion_jornada,
							alineacion_amarilla:childData.alineacion_amarilla,
							alineacion_gol:childData.alineacion_gol		
						});
				});
			}, function(errorObject){
				console.log("Error leyendo la jornada "+errorObject.code);
			});

			setTimeout(()=>{
				for (var i=0;i<alineaciones.length;i++){
					if(!jornada_equipo.includes(alineaciones[i])){
						var nuewPostKey=admin.database(alineacion_app).ref('alineacion_bundesliga/alineacion_bundesliga_2019_2020').push().key;
						admin.database(alineacion_app).ref('alineacion_bundesliga/alineacion_bundesliga_2019_2020/'+nuewPostKey).set({
							alineacion_asistencia:alineaciones[i].alineacion_asistencia,
							alineacion_temporada:alineaciones[i].alineacion_temporada,
							alineacion_cambio:alineaciones[i].alineacion_cambio,
							alineacion_estado:alineaciones[i].alineacion_estado,
							alineacion_roja:alineaciones[i].alineacion_roja,
							alineacion_equipo:alineaciones[i].alineacion_equipo,
							alineacion_lesion:alineaciones[i].alineacion_lesion,
							alineacion_jugador:alineaciones[i].alineacion_jugador,
							alineacion_jornada:alineaciones[i].alineacion_jornada,
							alineacion_amarilla:alineaciones[i].alineacion_amarilla,
							alineacion_gol:alineaciones[i].alineacion_gol,		
						});
					}
				}
			},200000);
		}, 150000);

	

	}, 30000);
});

exports.ClasificacionActualiza_1_Bundesliga=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i;
	var jornadaroot1 = admin.database(jornada_app).ref('bundesliga/value');
	jornadaroot1.on("value",function(snapshot){
		i = snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
	const url_clasificacion='https://www.resultados-futbol.com/bundesliga2020/grupo1/jornada'
	const clasificacion=[];

	setTimeout(() => {   

		axios(url_clasificacion+i)
			.then(response=>{
				var html=response.data;
				var $ = cheerio.load(html);
				var clasif = $('#tabla2 tbody > tr');
				var jor="Jornada "+i;
				

				clasif.each(function(){

					var equipo=$(this).find('a').text();
					var puntos=$(this).find('.pts').text();
					var posicion=$(this).find('th').text();
					var pjugados=$(this).find('.pj').text();
					var ganados=$(this).find('.win').text();
					var empatados=$(this).find('.draw').text();
					var perdidos=$(this).find('.lose').text();
					var gfavor=$(this).find('.f').text();
					var gcontra=$(this).find('.c').text();
					//console.log(jor+" "+local+" "+resultado+" "+visitante)

					clasificacion.push({
						clasificacion_temporada:"Temporada2020",
						clasificacion_jornada:jor,
						clasificacion_posicion:parseInt(posicion),
						clasificacion_equipo:equipo,
						clasificacion_puntos:parseInt(puntos),
						clasificacion_partidos_jugados:parseInt(pjugados),
						clasificacion_ganados:parseInt(ganados),
						clasificacion_empatados:parseInt(empatados),
						clasificacion_perdidos:parseInt(perdidos),
						clasificacion_goles_favor:parseInt(gfavor),
						clasificacion_goles_contra:parseInt(gcontra),
					});
					//console.log("entra");
					return true;
					
				});
				return true;
			})
			.catch(console.error);
	}, 20000);

	setTimeout(() => {   

		var equipo="";
		var equiporoot = admin.database(clasificacion_app).ref('clasificacion_bundesliga');
		equiporoot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<clasificacion.length;id++){
					if (childData.clasificacion_jornada===clasificacion[id].clasificacion_jornada && 
						childData.clasificacion_temporada===clasificacion[id].clasificacion_temporada &&
						childData.clasificacion_equipo===clasificacion[id].clasificacion_equipo){
						var equiporoot1 = admin.database(clasificacion_app).ref('clasificacion_bundesliga/'+key);
						equiporoot1.update({"clasificacion_posicion":clasificacion[id].clasificacion_posicion, 
							"clasificacion_puntos":clasificacion[id].clasificacion_puntos,
							"clasificacion_partidos_jugados":clasificacion[id].clasificacion_partidos_jugados,
							"clasificacion_ganados":clasificacion[id].clasificacion_ganados,
							"clasificacion_empatados":clasificacion[id].clasificacion_empatados,
							"clasificacion_perdidos":clasificacion[id].clasificacion_perdidos,
							"clasificacion_goles_favor":clasificacion[id].clasificacion_goles_favor,
							"clasificacion_goles_contra":clasificacion[id].clasificacion_goles_contra});
					}
				}

			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 50000);


	/*
	
	setTimeout(() => {   
		for (var id=0;id<clasificacion.length;id++){
			var nuewPostKey=admin.database(otherApp).ref('clasificacion').push().key;
			admin.database(otherApp).ref('clasificacion/'+nuewPostKey).set({
				clasificacion_temporada:clasificacion[id].clasificacion_temporada,
				clasificacion_jornada:clasificacion[id].clasificacion_jornada,
				clasificacion_posicion:clasificacion[id].clasificacion_posicion,
				clasificacion_equipo:clasificacion[id].clasificacion_equipo,
				clasificacion_puntos:clasificacion[id].clasificacion_puntos,
				clasificacion_partidos_jugados:clasificacion[id].clasificacion_partidos_jugados,
				clasificacion_ganados:clasificacion[id].clasificacion_ganados,
				clasificacion_empatados:clasificacion[id].clasificacion_empatados,
				clasificacion_perdidos:clasificacion[id].clasificacion_perdidos,
				clasificacion_goles_favor:clasificacion[id].clasificacion_goles_favor,
				clasificacion_goles_contra:clasificacion[id].clasificacion_goles_contra
			});
		}
	}, 20000);

	*/
});


exports.Plantilla_Bundesliga=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i=getJornadaLaLiga();
	const rp = require('request-promise');
	const cheerio=require('cheerio');
	const axios=require('axios');
	const fs = require('fs');
	const urls_plantilla=['https://www.resultados-futbol.com/plantilla/Bayern-Munchen', 'https://www.resultados-futbol.com/plantilla/Borussia-Dortmund',
'https://www.resultados-futbol.com/plantilla/Rb-Leipzig', 'https://www.resultados-futbol.com/plantilla/Borussia-Monchengla',
'https://www.resultados-futbol.com/plantilla/Bayer-Leverkusen','https://www.resultados-futbol.com/plantilla/Schalke-04',
'https://www.resultados-futbol.com/plantilla/Wolfsburg','https://www.resultados-futbol.com/plantilla/Sc-Freiburg',
'https://www.resultados-futbol.com/plantilla/Tsg-1899-Hoffenheim','https://www.resultados-futbol.com/plantilla/1-Fc-Koln',
'https://www.resultados-futbol.com/plantilla/1-Fc-Union-Berlin','https://www.resultados-futbol.com/plantilla/Eintracht-Frankfurt',
'https://www.resultados-futbol.com/plantilla/Hertha-Bsc','https://www.resultados-futbol.com/plantilla/Fc-Augsburg',
'https://www.resultados-futbol.com/plantilla/Mainz-Amat','https://www.resultados-futbol.com/plantilla/Fortuna-Dusseldorf',
'https://www.resultados-futbol.com/plantilla/Werder-Bremen','https://www.resultados-futbol.com/plantilla/Paderborn'];

	const plantilla=[];
	const plantillas_descargadas=[''];

	for (const a in urls_plantilla){

		var url_actual=urls_plantilla[a];

		axios(url_actual)
			.then(response=>{
				setTimeout(()=>{
					plantillas_descargadas.push(urls_plantilla[a]);
					var html=response.data;
					var $ = cheerio.load(html);
					var equipo=$('#titlehc .name h1').text();
					//console.log(equipo);
					console.log(equipo);
					var plant = $('.sdata_table tbody > tr');
					//console.log(plant.text());
					
					var puesto="";
					plant.each(function(){
						if($(this).find('.first-child .axis').text()==="Portero"||
							$(this).find('.first-child .axis').text()==="Defensa" ||
							$(this).find('.first-child .axis').text()==="Centrocampista"||
							$(this).find('.first-child .axis').text()==="Delantero"){
							puesto=$(this).find('.first-child .axis').text();
						}else{
							var numero=$(this).find('.num').text();
							var foto=$(this).find('.sdata_player_img img').attr('src');
							var nombre=$(this).find('.sdata_player_name a span').text();
							var edad=$(this).find('.birthdate').text();
							var pais=$(this).find('.ori img').attr('src');
							var datos=$(this).find('.dat').text();
							var altura=datos.substr(0,3);
							var peso=datos.substr(3,2);
							var goles=datos.substr(5,1);
							var rojas=datos.substr(6,1);
							var amarillas=datos.substr(7,1);

							if(goles==="-"){
								goles="0";
							}
							if (rojas==="-"){
								rojas="0";
							}
							if(amarillas==="-"){
								amarillas="0";
							}
							
							//console.log(jor+" "+local+" "+resultado+" "+visitante)

							plantilla.push({
								plantilla_temporada:"Temporada2020",
								plantilla_equipo:equipo,
								plantilla_dorsal:numero,
								plantilla_foto:foto,
								plantilla_name:nombre,
								plantilla_posicion:puesto,
								plantilla_edad:edad,
								plantilla_pais:pais,
								plantilla_altura:altura,
								plantilla_peso:peso,
								plantilla_goles:goles,
								plantilla_rojas:rojas,
								plantilla_amarillas:amarillas,			
							});

						}

						return true;
						//console.log("entra");
					});
				},2000);
				return true;
			})
			.catch(console.error);
	}


	

	setTimeout(() => {   

		plantillas_por_descargar=[];

		for (var z=0;z<urls_plantilla.length;z++){
			if (plantillas_descargadas.includes(urls_plantilla[z])){
				//nada
			}else{
				plantillas_por_descargar.push(urls_plantilla[z]);
				
			}
		}

		for (const a in plantillas_por_descargar){

			var url_actual=plantillas_por_descargar[a];

			axios(url_actual)
				.then(response=>{
					setTimeout(()=>{
						//plantillas_descargadas.push(urls_plantilla[a]);
						var html=response.data;
						var $ = cheerio.load(html);
						var equipo=$('#titlehc .name h1').text();
						//console.log(equipo);
						console.log(equipo);
						var plant = $('.sdata_table tbody > tr');
						//console.log(plant.text());
						
						var puesto="";
						plant.each(function(){
							if($(this).find('.first-child .axis').text()==="Portero"||
								$(this).find('.first-child .axis').text()==="Defensa" ||
								$(this).find('.first-child .axis').text()==="Centrocampista"||
								$(this).find('.first-child .axis').text()==="Delantero"){
								puesto=$(this).find('.first-child .axis').text();
							}else{
								var numero=$(this).find('.num').text();
								var foto=$(this).find('.sdata_player_img img').attr('src');
								var nombre=$(this).find('.sdata_player_name a span').text();
								var edad=$(this).find('.birthdate').text();
								var pais=$(this).find('.ori img').attr('src');
								var datos=$(this).find('.dat').text();
								var altura=datos.substr(0,3);
								var peso=datos.substr(3,2);
								var goles=datos.substr(5,1);
								var rojas=datos.substr(6,1);
								var amarillas=datos.substr(7,1);

								if(goles==="-"){
									goles="0";
								}
								if (rojas==="-"){
									rojas="0";
								}
								if(amarillas==="-"){
									amarillas="0";
								}
								
								//console.log(jor+" "+local+" "+resultado+" "+visitante)

								plantilla.push({
									plantilla_temporada:"Temporada2020",
									plantilla_equipo:equipo,
									plantilla_dorsal:numero,
									plantilla_foto:foto,
									plantilla_name:nombre,
									plantilla_posicion:puesto,
									plantilla_edad:edad,
									plantilla_pais:pais,
									plantilla_altura:altura,
									plantilla_peso:peso,
									plantilla_goles:goles,
									plantilla_rojas:rojas,
									plantilla_amarillas:amarillas,			
								});

							}

							return true;
							//console.log("entra");
						});
					},2000);
					return true;
				})
				.catch(console.error);
		}
		
	}, 60000);


	setTimeout(() => {   

		var plantilla="";
		var plantillaroot = admin.database(plantilla_app).ref('plantilla_bundesliga/plantilla_bundesliga_2019_2020');
		plantillaroot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<plantilla.length;id++){
					if (childData.plantilla_equipo===plantilla[id].plantilla_equipo && 
						childData.plantilla_name===plantilla[id].plantilla_name &&
						childData.plantilla_temporada===plantilla[id].plantilla_temporada){
						var plantillaroot1 = admin.database(plantilla_app).ref('plantilla_bundesliga/plantilla_bundesliga_2019_2020/'+key);
						equiporoot1.update({"plantilla_goles":plantilla[id].plantilla_goles, 
							"plantilla_rojas":plantilla[id].plantilla_rojas,
							"plantilla_amarillas":plantilla[id].plantilla_amarillas,
							"plantilla_edad":plantilla[id].plantilla_edad,
							"plantilla_dorsal":plantilla[id].plantilla_dorsal});
					}
				}
			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 100000);


/*
	
	setTimeout(() => {   
		for (var id=0;id<plantilla.length;id++){
			//console.log(plantilla[id].plantilla_equipo);
			var nuewPostKey=admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020').push().key;
			admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020/'+nuewPostKey).set({
				plantilla_temporada:plantilla[id].plantilla_temporada,
				plantilla_equipo:plantilla[id].plantilla_equipo,
				plantilla_dorsal:plantilla[id].plantilla_dorsal,
				plantilla_foto:plantilla[id].plantilla_foto,
				plantilla_name:plantilla[id].plantilla_name,
				plantilla_posicion:plantilla[id].plantilla_posicion,
				plantilla_edad:plantilla[id].plantilla_edad,
				plantilla_pais:plantilla[id].plantilla_pais,
				plantilla_altura:plantilla[id].plantilla_altura,
				plantilla_peso:plantilla[id].plantilla_peso,
				plantilla_goles:plantilla[id].plantilla_goles,
				plantilla_rojas:plantilla[id].plantilla_rojas,
				plantilla_amarillas:plantilla[id].plantilla_amarillas
			});
		}	
	},100000);
*/	
});


/********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
***********************  SERIE A  ****************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************/


exports.Partido_Alineacion_ActualizaPartido_Seriea=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i=getJornadaLaLiga();
	const url='https://www.resultados-futbol.com/serie_a2020/grupo1';
	const partidos=[];

	axios(url+'/jornada'+i)
		.then(response=>{
			var html=response.data;
			var $ = cheerio.load(html);
			var jornada = $('#tabla1 tbody > tr');
			var jor="Jornada "+i;
			

			jornada.each(function(){

				var result=$(this).attr('class').localeCompare('vevent');
				if (result===1) {
					var local=$(this).find('.equipo1 img').attr('alt');
					var foto_local=$(this).find('.equipo1 img').attr('src');
					var visitante=$(this).find('.equipo2 img').attr('alt');
					var foto_visitante=$(this).find('.equipo2 img').attr('src');
					var resultado=$(this).find('.rstd .url .clase').text();
					var fecha=$(this).find('.fecha').text();
					var fecha1=fecha.substr(9,9);

					//console.log(jor+" "+local+" "+resultado+" "+visitante)
					if (local ==="Hellas")
						local="Hellas Verona"
					if (local === "Palermo")
						local="SSD Palermo"

					if (visitante ==="Hellas")
						visitante="Hellas Verona"
					if (visitante === "Palermo")
						visitante="SSD Palermo"

					if (resultado === "")
						resultado="Aplazado"

					partidos.push({
						partidos_temporada:"Temporada2020",
						partidos_jornada:jor,
						partidos_foto_local:foto_local,
						partidos_equipo_local:local,
						partidos_foto_visitante:foto_visitante,
						partidos_equipo_visitante:visitante,
						partidos_resultado:resultado,
						partidos_fecha:fecha1,
					});
					//console.log("entra");

				}else{
					//console.log("no entra");
				}
				return true;
			});
			return true;
		})
		.catch(console.error);


	setTimeout(() => {   

		var partido="";
		var partidoroot = admin.database(partidos_app).ref('calendario_seriea');
		partidoroot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<partidos.length;id++){
					if (childData.partidos_equipo_local===partidos[id].partidos_equipo_local && childData.partidos_equipo_visitante===partidos[id].partidos_equipo_visitante){
						var partidoroot1 = admin.database(partidos_app).ref('calendario_seriea/'+key);
						partidoroot1.update({"partidos_fecha":partidos[id].partidos_fecha, "partidos_resultado":partidos[id].partidos_resultado});
					}
				}

			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 30000);

	setTimeout(() => {   
		var urls_alineacion=['Juventus-Fc', 'Lazio',
							'Internazionale', 'Atalanta',
							'Roma','Napoli',
							'Milan','Hellas-Verona-Fc',
							'Parma-Fc','Bologna',
							'Us-Sassuolo-Calcio','Cagliari',
							'Fiorentina','Udinese',
							'Torino-Fc','Sampdoria',
							'Genoa','Lecce',
							'Spal-1907','Brescia'];

		var urls_equipos=['Juventus','Lazio','Inter', 'Atalanta','Roma','Napoli','Milan','Hellas Verona','Parma','Bologna','Sassuolo',
'Cagliari','Fiorentina','Udinese','Torino','Sampdoria','Genoa', 'Lecce','SPAL','Brescia'];

		var enlace='https://www.resultados-futbol.com/partido/';

		var alineaciones=[];

		const alineaciones_descargadas=[];
		const alineaciones_total=[];

		var longitud=partidos.length;

		for (var p=0;p<longitud;p++){

			var partido=partidos.pop();

			var local=partido.partidos_equipo_local;
			var visitante=partido.partidos_equipo_visitante;


			var indice_local;
			var indice_visitante;

			for (var x=0;x<urls_equipos.length;x++){
				if(local===urls_equipos[x]){
					indice_local=x;
				}
				if(visitante===urls_equipos[x]){
					indice_visitante=x;
				}
			}

			var enlace_final=enlace+urls_alineacion[indice_local]+"/"+urls_alineacion[indice_visitante];

			alineaciones_total.push(enlace_final);

			var temporada="Temporada2020";
			var jornada="Jornada "+i;

			//console.log(enlace_final);

			axios(enlace_final)
				.then(response=>{

					alineaciones_descargadas.push(enlace_final);

					var html=response.data;
					//console.log(html);
					var $ = cheerio.load(html);

					var alineacion_equipo_local=$('.nteam.nteam1 a').text();
					var alineacion_equipo_visitante=$('.nteam.nteam2 a').text();

					if (alineacion_equipo_local ==="Hellas")
						alineacion_equipo_local="Hellas Verona"
					if (alineacion_equipo_local === "Palermo")
						alineacion_equipo_local="SSD Palermo"

					if (alineacion_equipo_visitante ==="Hellas")
						alineacion_equipo_visitante="Hellas Verona"
					if (alineacion_equipo_visitante === "Palermo")
						alineacion_equipo_visitante="SSD Palermo"

					console.log(alineacion_equipo_local+" "+alineacion_equipo_visitante);

					var equipo_local = $('.team.team1 ul > li');
					var equipo_visitante= $('.team.team2 ul > li');


					var eventos=$('#listado_eventos #teams_box .contentitem > .evento');

					var lesiones_local=[];
					var lesiones_visitante=[];
					var asistencias_local=[];
					var asistencias_visitante=[];
					var rojas_local=[];
					var rojas_visitante=[];
					var amarillas_local=[];
					var amarillas_visitante=[];
					var goles_local=[];
					var goles_visitante=[];
					var amarilla_roja_local=[];
					var amarilla_roja_visitante=[];

					eventos.each(function(){
						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de "){
							var jugador=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de "){
							var jugador1=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador1);
						}

						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de falta"){
							var jugador2=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador2);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de falta"){
							var jugador3=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador3);
						}
						if($(this).find('.left.event_11') && $(this).find('.left.event_11 small').text()==="Gol de penalti"){
							var jugador4=$(this).find('.left.event_11 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador4);
						}
						if($(this).find('.right.event_11') && $(this).find('.right.event_11 small').text()==="Gol de penalti"){
							var jugador5=$(this).find('.right.event_11 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador5);
						}
						if($(this).find('.left.event_12') && $(this).find('.left.event_12 small').text()==="Gol de "){
							var jugador6=$(this).find('.left.event_12 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador6);
						}
						if($(this).find('.right.event_12') && $(this).find('.right.event_12 small').text()==="Gol de "){
							var jugador7=$(this).find('.right.event_12 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador7);
						}

						if($(this).find('.left.event_8') && $(this).find('.left.event_8 small').text()==="T. Amarilla"){
							//console.log("entra amarilla");
							var jugador8=$(this).find('.left.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_local.push(jugador8);
						}
						if($(this).find('.right.event_8') && $(this).find('.right.event_8 small').text()==="T. Amarilla"){
							var jugador9=$(this).find('.right.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_visitante.push(jugador9);
						}
						if($(this).find('.left.event_5') && $(this).find('.left.event_5 small').text()==="Asistencia"){
							//console.log("entra asistencia");
							var jugador10=$(this).find('.left.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_local.push(jugador10);
						}
						if($(this).find('.right.event_5') && $(this).find('.right.event_5 small').text()==="Asistencia"){
							var jugador11=$(this).find('.right.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_visitante.push(jugador11);
						}
						if($(this).find('.left.event_10') && $(this).find('.left.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador12=$(this).find('.left.event_10 a').text();
							amarilla_roja_local.push(jugador12);
						}
						if($(this).find('.right.event_10') && $(this).find('.right.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador13=$(this).find('.right.event_10 a').text();
							amarilla_roja_visitante.push(jugador13);
						}
						if($(this).find('.left.event_4') && $(this).find('.left.event_4 small').text()==="Lesionado"){
							//console.log("entra Lesionado");
							var jugador14=$(this).find('.left.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_local.push(jugador14);
						}
						if($(this).find('.right.event_4') && $(this).find('.right.event_4 small').text()==="Lesionado"){
							var jugador15=$(this).find('.right.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_visitante.push(jugador15);
						}
						if($(this).find('.left.event_9') && $(this).find('.left.event_9 small').text()==="Tarjeta Roja a "){
							//console.log("entra roja");
							var jugador16=$(this).find('.left.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador16);
						}
						if($(this).find('.right.event_9') && $(this).find('.right.event_9 small').text()==="Tarjeta Roja a "){
							var jugador17=$(this).find('.right.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador17);
						}
						return true;
					});
			
				
					var est=0;
					equipo_local.each(function(){
						//console.log("entra local");
						//TITULAR/SUPLENTE
						var estado;
						if(est<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est=est+1;

						var nombre=$(this).find('.align-player').text();

						//console.log(nombre+" "+alineacion_equipo_local+" "+estado);
						var amarilla="0";
						for (a in amarillas_local){
							if(nombre===amarillas_local[a]){
								amarilla="1";
							}
						}
						var gol=0;
						for (b in goles_local){
							if(nombre===goles_local[b]){
								gol=gol+1;
							}
						}
						gol=String(gol);
						var cambio1;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1=$(this).find('.align-events span.flaticon-up12').text();
							cambio=cambio1.substr(0,2);
						}else{
							cambio="";
						}
						var roja="0";
						for(a in rojas_local){
							if(nombre===rojas_local[a]){
								roja="1";
							}
						}
						var lesion="0";
						for (a in lesiones_local){
							if (nombre===lesiones_local[a]){
								lesion="1";
							}
						}
						var asistencia=0;
						for (a in asistencias_local){
							if (asistencias_local[a] === nombre)
								asistencia=asistencia+1
						}
						asistencia=String(asistencia);

						for (a in amarilla_roja_local){
							if(nombre===amarilla_roja_local[a]){
								amarilla="2";
								roja="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio,
							alineacion_estado:estado,
							alineacion_roja:roja,
							alineacion_equipo:alineacion_equipo_local,
							alineacion_lesion:lesion,
							alineacion_jugador:nombre,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla,
							alineacion_gol:gol,		
						});

						return true;

					});


					var est1=0;
					equipo_visitante.each(function(){
						//TITULAR/SUPLENTE
						var estado;
						if(est1<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est1=est1+1;

						var nombre_visitante=$(this).find('.align-player').text();
						//console.log(nombre+" "+alineacion_equipo_visitante+" "+estado);
						var amarilla_visitante="0";
						for (b in amarillas_visitante){
							if(nombre_visitante===amarillas_visitante[b]){
								amarilla_visitante="1";
							}
						}
						var gol_visitante=0;
						for (b in goles_visitante){
							if(nombre_visitante===goles_visitante[b]){
								//console.log("gol visitante encaja");
								gol_visitante=gol_visitante+1;
								//console.log(gol_visitante);
							}
						}
						gol_visitante=String(gol_visitante);
						var cambio1_visitante;
						var cambio_visitante;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1_visitante=$(this).find('.align-events span.flaticon-up12').text();
							cambio_visitante=cambio1_visitante.substr(0,2);
						}else{
							cambio_visitante="";
						}
						var roja_visitante="0";
						for(b in rojas_visitante){
							if(nombre_visitante===rojas_visitante[b]){
								roja_visitante="1";
							}
						}
						var lesion_visitante="0";
						for (b in lesiones_visitante){
							if (nombre_visitante===lesiones_visitante[b]){
								lesion_visitante="1";
							}
						}
						var asistencia_visitante=0;
						for (b in asistencias_visitante){
							if (asistencias_visitante[b] === nombre_visitante)
								asistencia_visitante=asistencia_visitante+1
						}
						asistencia_visitante=String(asistencia_visitante);

						for (b in amarilla_roja_visitante){
							if(nombre_visitante===amarilla_roja_visitante[b]){
								amarilla_visitante="2";
								roja_visitante="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia_visitante,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio_visitante,
							alineacion_estado:estado,
							alineacion_roja:roja_visitante,
							alineacion_equipo:alineacion_equipo_visitante,
							alineacion_lesion:lesion_visitante,
							alineacion_jugador:nombre_visitante,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla_visitante,
							alineacion_gol:gol_visitante,		
						});
						return true;

					});
					return true;
				})
				.catch(console.error);

		}

		setTimeout(() => {   

			alineaciones_por_descargar=[];

			for (var z=0;z<alineaciones_total.length;z++){
				if (alineaciones_descargadas.includes(alineaciones_total[z])){
					//nada
				}else{
					alineaciones_por_descargar.push(alineaciones_total[z]);
					
				}
			}

			for (var m in alineaciones_por_descargar){
				var url_actual_alineacion=alineaciones_por_descargar[m];

				axios(url_actual_alineacion)
				.then(response=>{

					alineaciones_descargadas.push(enlace_final);

					var html=response.data;
					//console.log(html);
					var $ = cheerio.load(html);

					var alineacion_equipo_local=$('.nteam.nteam1 a').text();
					var alineacion_equipo_visitante=$('.nteam.nteam2 a').text();

					
					if (alineacion_equipo_local ==="Hellas")
						alineacion_equipo_local="Hellas Verona"
					if (alineacion_equipo_local === "Palermo")
						alineacion_equipo_local="SSD Palermo"

					if (alineacion_equipo_visitante ==="Hellas")
						alineacion_equipo_visitante="Hellas Verona"
					if (alineacion_equipo_visitante === "Palermo")
						alineacion_equipo_visitante="SSD Palermo"

					console.log(alineacion_equipo_local+" "+alineacion_equipo_visitante);

					var equipo_local = $('.team.team1 ul > li');
					var equipo_visitante= $('.team.team2 ul > li');


					var eventos=$('#listado_eventos #teams_box .contentitem > .evento');

					var lesiones_local=[];
					var lesiones_visitante=[];
					var asistencias_local=[];
					var asistencias_visitante=[];
					var rojas_local=[];
					var rojas_visitante=[];
					var amarillas_local=[];
					var amarillas_visitante=[];
					var goles_local=[];
					var goles_visitante=[];
					var amarilla_roja_local=[];
					var amarilla_roja_visitante=[];

					eventos.each(function(){
						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de "){
							var jugador=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de "){
							var jugador1=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador1);
						}

						if($(this).find('.left.event_1') && $(this).find('.left.event_1 small').text()==="Gol de falta"){
							var jugador2=$(this).find('.left.event_1 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador2);
						}
						if($(this).find('.right.event_1') && $(this).find('.right.event_1 small').text()==="Gol de falta"){
							var jugador3=$(this).find('.right.event_1 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador3);
						}
						if($(this).find('.left.event_11') && $(this).find('.left.event_11 small').text()==="Gol de penalti"){
							var jugador4=$(this).find('.left.event_11 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador4);
						}
						if($(this).find('.right.event_11') && $(this).find('.right.event_11 small').text()==="Gol de penalti"){
							var jugador5=$(this).find('.right.event_11 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador5);
						}
						if($(this).find('.left.event_12') && $(this).find('.left.event_12 small').text()==="Gol de "){
							var jugador6=$(this).find('.left.event_12 a').text();
							//console.log("gol "+jugador);
							goles_local.push(jugador6);
						}
						if($(this).find('.right.event_12') && $(this).find('.right.event_12 small').text()==="Gol de "){
							var jugador7=$(this).find('.right.event_12 a').text();
							//console.log("gol "+jugador);
							goles_visitante.push(jugador7);
						}

						if($(this).find('.left.event_8') && $(this).find('.left.event_8 small').text()==="T. Amarilla"){
							//console.log("entra amarilla");
							var jugador8=$(this).find('.left.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_local.push(jugador8);
						}
						if($(this).find('.right.event_8') && $(this).find('.right.event_8 small').text()==="T. Amarilla"){
							var jugador9=$(this).find('.right.event_8 a').text();
							//console.log("amarilla "+jugador);
							amarillas_visitante.push(jugador9);
						}
						if($(this).find('.left.event_5') && $(this).find('.left.event_5 small').text()==="Asistencia"){
							//console.log("entra asistencia");
							var jugador10=$(this).find('.left.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_local.push(jugador10);
						}
						if($(this).find('.right.event_5') && $(this).find('.right.event_5 small').text()==="Asistencia"){
							var jugador11=$(this).find('.right.event_5 a').text();
							//console.log("asistencia "+jugador);
							asistencias_visitante.push(jugador11);
						}
						if($(this).find('.left.event_10') && $(this).find('.left.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador12=$(this).find('.left.event_10 a').text();
							amarilla_roja_local.push(jugador12);
						}
						if($(this).find('.right.event_10') && $(this).find('.right.event_10 small').text()==="2a Amarilla y Roja"){
							var jugador13=$(this).find('.right.event_10 a').text();
							amarilla_roja_visitante.push(jugador13);
						}
						if($(this).find('.left.event_4') && $(this).find('.left.event_4 small').text()==="Lesionado"){
							//console.log("entra Lesionado");
							var jugador14=$(this).find('.left.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_local.push(jugador14);
						}
						if($(this).find('.right.event_4') && $(this).find('.right.event_4 small').text()==="Lesionado"){
							var jugador15=$(this).find('.right.event_4 a').text();
							//console.log("lesion "+jugador);
							lesiones_visitante.push(jugador15);
						}
						if($(this).find('.left.event_9') && $(this).find('.left.event_9 small').text()==="Tarjeta Roja a "){
							//console.log("entra roja");
							var jugador16=$(this).find('.left.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador16);
						}
						if($(this).find('.right.event_9') && $(this).find('.right.event_9 small').text()==="Tarjeta Roja a "){
							var jugador17=$(this).find('.right.event_9 a').text();
							//console.log("roja "+jugador);
							rojas_local.push(jugador17);
						}
						return true;
					});
			
				
					var est=0;
					equipo_local.each(function(){
						//console.log("entra local");
						//TITULAR/SUPLENTE
						var estado;
						if(est<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est=est+1;

						var nombre=$(this).find('.align-player').text();

						//console.log(nombre+" "+alineacion_equipo_local+" "+estado);
						var amarilla="0";
						for (a in amarillas_local){
							if(nombre===amarillas_local[a]){
								amarilla="1";
							}
						}
						var gol=0;
						for (b in goles_local){
							if(nombre===goles_local[b]){
								gol=gol+1;
							}
						}
						gol=String(gol);
						var cambio1;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1=$(this).find('.align-events span.flaticon-up12').text();
							cambio=cambio1.substr(0,2);
						}else{
							cambio="";
						}
						var roja="0";
						for(a in rojas_local){
							if(nombre===rojas_local[a]){
								roja="1";
							}
						}
						var lesion="0";
						for (a in lesiones_local){
							if (nombre===lesiones_local[a]){
								lesion="1";
							}
						}
						var asistencia=0;
						for (a in asistencias_local){
							if (asistencias_local[a] === nombre)
								asistencia=asistencia+1
						}
						asistencia=String(asistencia);

						for (a in amarilla_roja_local){
							if(nombre===amarilla_roja_local[a]){
								amarilla="2";
								roja="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio,
							alineacion_estado:estado,
							alineacion_roja:roja,
							alineacion_equipo:alineacion_equipo_local,
							alineacion_lesion:lesion,
							alineacion_jugador:nombre,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla,
							alineacion_gol:gol,		
						});

						return true;

					});


					var est1=0;
					equipo_visitante.each(function(){
						//TITULAR/SUPLENTE
						var estado;
						if(est1<11){
							estado="Titular";
						}else{
							estado="Suplente";
						}
						est1=est1+1;

						var nombre_visitante=$(this).find('.align-player').text();
						//console.log(nombre+" "+alineacion_equipo_visitante+" "+estado);
						var amarilla_visitante="0";
						for (b in amarillas_visitante){
							if(nombre_visitante===amarillas_visitante[b]){
								amarilla_visitante="1";
							}
						}
						var gol_visitante=0;
						for (b in goles_visitante){
							if(nombre_visitante===goles_visitante[b]){
								//console.log("gol visitante encaja");
								gol_visitante=gol_visitante+1;
								//console.log(gol_visitante);
							}
						}
						gol_visitante=String(gol_visitante);
						var cambio1_visitante;
						var cambio_visitante;
						if($(this).find('.align-events span.flaticon-up12')){
							cambio1_visitante=$(this).find('.align-events span.flaticon-up12').text();
							cambio_visitante=cambio1_visitante.substr(0,2);
						}else{
							cambio_visitante="";
						}
						var roja_visitante="0";
						for(b in rojas_visitante){
							if(nombre_visitante===rojas_visitante[b]){
								roja_visitante="1";
							}
						}
						var lesion_visitante="0";
						for (b in lesiones_visitante){
							if (nombre_visitante===lesiones_visitante[b]){
								lesion_visitante="1";
							}
						}
						var asistencia_visitante=0;
						for (b in asistencias_visitante){
							if (asistencias_visitante[b] === nombre_visitante)
								asistencia_visitante=asistencia_visitante+1
						}
						asistencia_visitante=String(asistencia_visitante);

						for (b in amarilla_roja_visitante){
							if(nombre_visitante===amarilla_roja_visitante[b]){
								amarilla_visitante="2";
								roja_visitante="1";
							}
						}

						alineaciones.push({
							alineacion_asistencia:asistencia_visitante,
							alineacion_temporada:temporada,
							alineacion_cambio:cambio_visitante,
							alineacion_estado:estado,
							alineacion_roja:roja_visitante,
							alineacion_equipo:alineacion_equipo_visitante,
							alineacion_lesion:lesion_visitante,
							alineacion_jugador:nombre_visitante,
							alineacion_jornada:jornada,
							alineacion_amarilla:amarilla_visitante,
							alineacion_gol:gol_visitante,		
						});
						return true;

					});
					return true;
				})
				.catch(console.error);
			}

		}, 90000);


		
		setTimeout(() => {
			var jornada_equipo=[];

			var alineacionroot = admin.database(alineacion_app).ref('alineacion_seriea/alineacion_seriea_2019_2020');
			alineacionroot.on("value",function(snapshot){
				snapshot.forEach(function(childSnapshot) {
					var key = childSnapshot.key;
					var childData = childSnapshot.val();
					jornada_equipo.push({
							alineacion_asistencia:childData.alineacion_asistencia,
							alineacion_temporada:childData.alineacion_temporada,
							alineacion_cambio:childData.alineacion_cambio,
							alineacion_estado:childData.alineacion_estado,
							alineacion_roja:childData.alineacion_roja,
							alineacion_equipo:childData.alineacion_equipo,
							alineacion_lesion:childData.alineacion_lesion,
							alineacion_jugador:childData.alineacion_jugador,
							alineacion_jornada:childData.alineacion_jornada,
							alineacion_amarilla:childData.alineacion_amarilla,
							alineacion_gol:childData.alineacion_gol		
						});
				});
			}, function(errorObject){
				console.log("Error leyendo la jornada "+errorObject.code);
			});

			setTimeout(()=>{
				for (var i=0;i<alineaciones.length;i++){
					if(!jornada_equipo.includes(alineaciones[i])){
						var nuewPostKey=admin.database(alineacion_app).ref('alineacion_seriea/alineacion_seriea_2019_2020').push().key;
						admin.database(alineacion_app).ref('alineacion_seriea/alineacion_seriea_2019_2020/'+nuewPostKey).set({
							alineacion_asistencia:alineaciones[i].alineacion_asistencia,
							alineacion_temporada:alineaciones[i].alineacion_temporada,
							alineacion_cambio:alineaciones[i].alineacion_cambio,
							alineacion_estado:alineaciones[i].alineacion_estado,
							alineacion_roja:alineaciones[i].alineacion_roja,
							alineacion_equipo:alineaciones[i].alineacion_equipo,
							alineacion_lesion:alineaciones[i].alineacion_lesion,
							alineacion_jugador:alineaciones[i].alineacion_jugador,
							alineacion_jornada:alineaciones[i].alineacion_jornada,
							alineacion_amarilla:alineaciones[i].alineacion_amarilla,
							alineacion_gol:alineaciones[i].alineacion_gol,		
						});
					}
				}
			},200000);
		}, 150000);

	

	}, 30000);
});

exports.ClasificacionActualiza_1_SerieA=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i;
	var jornadaroot1 = admin.database(jornada_app).ref('seriea/value');
	jornadaroot1.on("value",function(snapshot){
		i = snapshot.val();
	}, function(errorObject){
		console.log("Error leyendo la jornada "+errorObject.code);
	});
	const url_clasificacion='https://www.resultados-futbol.com/serie_a2020/grupo1/jornada'
	const clasificacion=[];

	setTimeout(() => {   

		axios(url_clasificacion+i)
			.then(response=>{
				var html=response.data;
				var $ = cheerio.load(html);
				var clasif = $('#tabla2 tbody > tr');
				var jor="Jornada "+i;
				

				clasif.each(function(){

					var equipo=$(this).find('a').text();
					var puntos=$(this).find('.pts').text();
					var posicion=$(this).find('th').text();
					var pjugados=$(this).find('.pj').text();
					var ganados=$(this).find('.win').text();
					var empatados=$(this).find('.draw').text();
					var perdidos=$(this).find('.lose').text();
					var gfavor=$(this).find('.f').text();
					var gcontra=$(this).find('.c').text();
					//console.log(jor+" "+local+" "+resultado+" "+visitante)

					clasificacion.push({
						clasificacion_temporada:"Temporada2020",
						clasificacion_jornada:jor,
						clasificacion_posicion:parseInt(posicion),
						clasificacion_equipo:equipo,
						clasificacion_puntos:parseInt(puntos),
						clasificacion_partidos_jugados:parseInt(pjugados),
						clasificacion_ganados:parseInt(ganados),
						clasificacion_empatados:parseInt(empatados),
						clasificacion_perdidos:parseInt(perdidos),
						clasificacion_goles_favor:parseInt(gfavor),
						clasificacion_goles_contra:parseInt(gcontra),
					});
					//console.log("entra");
					return true;
					
				});
				return true;
			})
			.catch(console.error);
	}, 20000);

	setTimeout(() => {   

		var equipo="";
		var equiporoot = admin.database(clasificacion_app).ref('clasificacion_seriea');
		equiporoot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<clasificacion.length;id++){
					if (childData.clasificacion_jornada===clasificacion[id].clasificacion_jornada && 
						childData.clasificacion_temporada===clasificacion[id].clasificacion_temporada &&
						childData.clasificacion_equipo===clasificacion[id].clasificacion_equipo){
						var equiporoot1 = admin.database(clasificacion_app).ref('clasificacion_seriea/'+key);
						equiporoot1.update({"clasificacion_posicion":clasificacion[id].clasificacion_posicion, 
							"clasificacion_puntos":clasificacion[id].clasificacion_puntos,
							"clasificacion_partidos_jugados":clasificacion[id].clasificacion_partidos_jugados,
							"clasificacion_ganados":clasificacion[id].clasificacion_ganados,
							"clasificacion_empatados":clasificacion[id].clasificacion_empatados,
							"clasificacion_perdidos":clasificacion[id].clasificacion_perdidos,
							"clasificacion_goles_favor":clasificacion[id].clasificacion_goles_favor,
							"clasificacion_goles_contra":clasificacion[id].clasificacion_goles_contra});
					}
				}

			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 50000);


	/*
	
	setTimeout(() => {   
		for (var id=0;id<clasificacion.length;id++){
			var nuewPostKey=admin.database(otherApp).ref('clasificacion').push().key;
			admin.database(otherApp).ref('clasificacion/'+nuewPostKey).set({
				clasificacion_temporada:clasificacion[id].clasificacion_temporada,
				clasificacion_jornada:clasificacion[id].clasificacion_jornada,
				clasificacion_posicion:clasificacion[id].clasificacion_posicion,
				clasificacion_equipo:clasificacion[id].clasificacion_equipo,
				clasificacion_puntos:clasificacion[id].clasificacion_puntos,
				clasificacion_partidos_jugados:clasificacion[id].clasificacion_partidos_jugados,
				clasificacion_ganados:clasificacion[id].clasificacion_ganados,
				clasificacion_empatados:clasificacion[id].clasificacion_empatados,
				clasificacion_perdidos:clasificacion[id].clasificacion_perdidos,
				clasificacion_goles_favor:clasificacion[id].clasificacion_goles_favor,
				clasificacion_goles_contra:clasificacion[id].clasificacion_goles_contra
			});
		}
	}, 20000);

	*/
});


exports.Plantilla_SerieA=functions.pubsub.schedule('0 4 * * 1,5').onRun((context)=> {
	var i=getJornadaLaLiga();
	const rp = require('request-promise');
	const cheerio=require('cheerio');
	const axios=require('axios');
	const fs = require('fs');
	const urls_plantilla=['https://www.resultados-futbol.com/plantilla/Juventus-Fc', 'https://www.resultados-futbol.com/plantilla/Lazio',
'https://www.resultados-futbol.com/plantilla/Internazionale', 'https://www.resultados-futbol.com/plantilla/Atalanta',
'https://www.resultados-futbol.com/plantilla/Roma','https://www.resultados-futbol.com/plantilla/Napoli',
'https://www.resultados-futbol.com/plantilla/Milan','https://www.resultados-futbol.com/plantilla/Hellas-Verona-Fc',
'https://www.resultados-futbol.com/plantilla/Parma-Fc','https://www.resultados-futbol.com/plantilla/Bologna',
'https://www.resultados-futbol.com/plantilla/Us-Sassuolo-Calcio','https://www.resultados-futbol.com/plantilla/Cagliari',
'https://www.resultados-futbol.com/plantilla/Fiorentina','https://www.resultados-futbol.com/plantilla/Udinese',
'https://www.resultados-futbol.com/plantilla/Torino-Fc','https://www.resultados-futbol.com/plantilla/Sampdoria',
'https://www.resultados-futbol.com/plantilla/Genoa','https://www.resultados-futbol.com/plantilla/Lecce',
'https://www.resultados-futbol.com/plantilla/Spal-1907','https://www.resultados-futbol.com/plantilla/Brescia'];

	const plantilla=[];
	const plantillas_descargadas=[''];

	for (const a in urls_plantilla){

		var url_actual=urls_plantilla[a];

		axios(url_actual)
			.then(response=>{
				setTimeout(()=>{
					plantillas_descargadas.push(urls_plantilla[a]);
					var html=response.data;
					var $ = cheerio.load(html);
					var equipo=$('#titlehc .name h1').text();
					//console.log(equipo);
					console.log(equipo);
					var plant = $('.sdata_table tbody > tr');
					//console.log(plant.text());
					
					var puesto="";
					plant.each(function(){
						if($(this).find('.first-child .axis').text()==="Portero"||
							$(this).find('.first-child .axis').text()==="Defensa" ||
							$(this).find('.first-child .axis').text()==="Centrocampista"||
							$(this).find('.first-child .axis').text()==="Delantero"){
							puesto=$(this).find('.first-child .axis').text();
						}else{
							var numero=$(this).find('.num').text();
							var foto=$(this).find('.sdata_player_img img').attr('src');
							var nombre=$(this).find('.sdata_player_name a span').text();
							var edad=$(this).find('.birthdate').text();
							var pais=$(this).find('.ori img').attr('src');
							var datos=$(this).find('.dat').text();
							var altura=datos.substr(0,3);
							var peso=datos.substr(3,2);
							var goles=datos.substr(5,1);
							var rojas=datos.substr(6,1);
							var amarillas=datos.substr(7,1);

							if(goles==="-"){
								goles="0";
							}
							if (rojas==="-"){
								rojas="0";
							}
							if(amarillas==="-"){
								amarillas="0";
							}
							
							//console.log(jor+" "+local+" "+resultado+" "+visitante)

							plantilla.push({
								plantilla_temporada:"Temporada2020",
								plantilla_equipo:equipo,
								plantilla_dorsal:numero,
								plantilla_foto:foto,
								plantilla_name:nombre,
								plantilla_posicion:puesto,
								plantilla_edad:edad,
								plantilla_pais:pais,
								plantilla_altura:altura,
								plantilla_peso:peso,
								plantilla_goles:goles,
								plantilla_rojas:rojas,
								plantilla_amarillas:amarillas,			
							});

						}

						return true;
						//console.log("entra");
					});
				},2000);
				return true;
			})
			.catch(console.error);
	}


	

	setTimeout(() => {   

		plantillas_por_descargar=[];

		for (var z=0;z<urls_plantilla.length;z++){
			if (plantillas_descargadas.includes(urls_plantilla[z])){
				//nada
			}else{
				plantillas_por_descargar.push(urls_plantilla[z]);
				
			}
		}

		for (const a in plantillas_por_descargar){

			var url_actual=plantillas_por_descargar[a];

			axios(url_actual)
				.then(response=>{
					setTimeout(()=>{
						//plantillas_descargadas.push(urls_plantilla[a]);
						var html=response.data;
						var $ = cheerio.load(html);
						var equipo=$('#titlehc .name h1').text();
						//console.log(equipo);
						console.log(equipo);
						var plant = $('.sdata_table tbody > tr');
						//console.log(plant.text());
						
						var puesto="";
						plant.each(function(){
							if($(this).find('.first-child .axis').text()==="Portero"||
								$(this).find('.first-child .axis').text()==="Defensa" ||
								$(this).find('.first-child .axis').text()==="Centrocampista"||
								$(this).find('.first-child .axis').text()==="Delantero"){
								puesto=$(this).find('.first-child .axis').text();
							}else{
								var numero=$(this).find('.num').text();
								var foto=$(this).find('.sdata_player_img img').attr('src');
								var nombre=$(this).find('.sdata_player_name a span').text();
								var edad=$(this).find('.birthdate').text();
								var pais=$(this).find('.ori img').attr('src');
								var datos=$(this).find('.dat').text();
								var altura=datos.substr(0,3);
								var peso=datos.substr(3,2);
								var goles=datos.substr(5,1);
								var rojas=datos.substr(6,1);
								var amarillas=datos.substr(7,1);

								if(goles==="-"){
									goles="0";
								}
								if (rojas==="-"){
									rojas="0";
								}
								if(amarillas==="-"){
									amarillas="0";
								}
								
								//console.log(jor+" "+local+" "+resultado+" "+visitante)

								plantilla.push({
									plantilla_temporada:"Temporada2020",
									plantilla_equipo:equipo,
									plantilla_dorsal:numero,
									plantilla_foto:foto,
									plantilla_name:nombre,
									plantilla_posicion:puesto,
									plantilla_edad:edad,
									plantilla_pais:pais,
									plantilla_altura:altura,
									plantilla_peso:peso,
									plantilla_goles:goles,
									plantilla_rojas:rojas,
									plantilla_amarillas:amarillas,			
								});

							}

							return true;
							//console.log("entra");
						});
					},2000);
					return true;
				})
				.catch(console.error);
		}
		
	}, 60000);


	setTimeout(() => {   

		var plantilla="";
		var plantillaroot = admin.database(plantilla_app).ref('plantilla_seriea/plantilla_seriea_2019_2020');
		plantillaroot.on("value",function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var key = childSnapshot.key;
				var childData = childSnapshot.val();
				for (var id=0;id<plantilla.length;id++){
					if (childData.plantilla_equipo===plantilla[id].plantilla_equipo && 
						childData.plantilla_name===plantilla[id].plantilla_name &&
						childData.plantilla_temporada===plantilla[id].plantilla_temporada){
						var plantillaroot1 = admin.database(plantilla_app).ref('plantilla_seriea/plantilla_seriea_2019_2020/'+key);
						equiporoot1.update({"plantilla_goles":plantilla[id].plantilla_goles, 
							"plantilla_rojas":plantilla[id].plantilla_rojas,
							"plantilla_amarillas":plantilla[id].plantilla_amarillas,
							"plantilla_edad":plantilla[id].plantilla_edad,
							"plantilla_dorsal":plantilla[id].plantilla_dorsal});
					}
				}
			});
		}, function(errorObject){
			console.log("Error leyendo la jornada "+errorObject.code);
		});

	}, 100000);


/*
	
	setTimeout(() => {   
		for (var id=0;id<plantilla.length;id++){
			//console.log(plantilla[id].plantilla_equipo);
			var nuewPostKey=admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020').push().key;
			admin.database(plantilla_app).ref('plantilla_laliga/plantilla_laliga_2019_2020/'+nuewPostKey).set({
				plantilla_temporada:plantilla[id].plantilla_temporada,
				plantilla_equipo:plantilla[id].plantilla_equipo,
				plantilla_dorsal:plantilla[id].plantilla_dorsal,
				plantilla_foto:plantilla[id].plantilla_foto,
				plantilla_name:plantilla[id].plantilla_name,
				plantilla_posicion:plantilla[id].plantilla_posicion,
				plantilla_edad:plantilla[id].plantilla_edad,
				plantilla_pais:plantilla[id].plantilla_pais,
				plantilla_altura:plantilla[id].plantilla_altura,
				plantilla_peso:plantilla[id].plantilla_peso,
				plantilla_goles:plantilla[id].plantilla_goles,
				plantilla_rojas:plantilla[id].plantilla_rojas,
				plantilla_amarillas:plantilla[id].plantilla_amarillas
			});
		}	
	},100000);
*/	
});
