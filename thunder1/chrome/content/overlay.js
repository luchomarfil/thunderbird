function prepararPalabrasIgnoradas(){
  this.palabrasIgnoradas = {};
  this.palabrasIgnoradasArray = "nueva nuevo entre dentro a ante bajo cabe con contra de desde hasta para por segun sin sobre tras ustedes ellos nosotros ".split(" ");  
  this.palabrasIgnoradasArray = this.palabrasIgnoradasArray.concat("dólar además asimismo del mismo modo de la misma manera igualmente no solo sino también a causa como debido gracias por culpa porque puesto que visto dado ya menos con condición tal en caso si siempre suponiendo consecuencia así ahí entonces consiguiente esa razón eso es lo tanto fin el objetivo intención objeto para saber efecto otras palabras decir o sea ejemplo pesar al contrario aunque cambio comparación comparado mientras obstante pero sin embargo ante todo antes nada después cual primer segundo último lugar finalmente luego concluir empezar terminar otra parte otro lado una un primero sobre y sucesivamente demás respecto propósito he dicho se mencionó anteriormente relación relativo cuanto ese respecta según mostrado conclusión definitiva pocas resumen suma resumir partir actualmente ahora final principio apenas tan pronto cuando desde durante nuestros días tiempo enseguida hasta hoy día más tarde vez".split(" "));
  for each (var item in palabrasIgnoradasArray) {
      this.palabrasIgnoradas[item] = true;
  }
}

this.minimoRepeticiones = 50;
this.minimoTamanioPalabra = 5;
this.prepararPalabrasIgnoradas();



window.addEventListener("load", function(e) { 
	startup(); 
}, false);

window.setInterval(
	function() {
		startup();  
	}, 60000); //update date every minute

function startup() {
    //console.log("prueba");
  	var myPanel = document.getElementById("my-panel");
		if(myPanel){
	  	var date = new Date();
	  	var day = date.getDay();
	  	var dateString = date.getFullYear() + "." + (date.getMonth()+1) + "." + date.getDate();
	  	myPanel.label = "Date: " + dateString;
		}
}

function contarPalabras(){
	var aURL = "chrome://wordsTracker/content/wordsTrackerTab.xul";  
	let tabmail = document.getElementById("tabmail");  
	tabmail.openTab("chromeTab", { chromePage: aURL })	
}


function analizarPalabras(){
  window.setTimeout(function() {
      analizarPalabrasAsynch();
  }, 1000);  
}


function analizarPalabrasAsynch(){
		//1 Obtengo todos los asuntos de rss
		var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);  
    var accounts = acctMgr.accounts; 
		var cuentasRSS = [];
    this.listaPalabras = {} 
		console.log("accounts: "+ accounts);
		//se filtran solo las del tipo rss
    for (var i = 0; i < accounts.length; i++) {  
         var account = accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount);  
				 if (account.incomingServer.type == "rss"){
					  cuentasRSS.push(account);
				 }
     }  
		 //se imprimen los mensaes de esas cuentas
		 for (var i = 0; i < cuentasRSS.length; i++) {  
			  var account = cuentasRSS[i];
			  var rootFolder = account.incomingServer.rootFolder; // nsIMsgFolder  
				if (rootFolder.hasSubFolders) {  
						var subFolders = rootFolder.subFolders; // nsIMsgFolder  
						while(subFolders.hasMoreElements()) {  
								//if (theFolder == subFolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder))  
								 //   return account.QueryInterface(Components.interfaces.nsIMsgAccount);  
							 var aFolder = subFolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
							 var msgArray = aFolder.messages;  
				//			 console.log("account:"+account.incomingServer.constructedPrettyName+" folder:"+aFolder.name);
							 while( msgArray.hasMoreElements() ) {  
									 let msgHdr = msgArray.getNext().QueryInterface(Components.interfaces.nsIMsgDBHdr);  									 
									 procesarMensaje(msgHdr);
							 }	
						}  
				}		
		 }
     
     //aca obtengo todos las palabras utilizadas
     //se ordenan por relevancia
     this.palabrasOrdenadas = sortMapByValue(this.listaPalabras);
     //se imprime en pantalla
     //console.log(this.palabrasOrdenadas);     
     $("p#wordsTracker-textOutput")[0].innerHTML = this.palabrasOrdenadas;
     jQuery('#palabras-body').append('<tr><td class="pref-name">accessibility.</td><td class="pref-value">40</td></tr>');
}

function procesarMensaje(mensaje){
    let title = mensaje.mime2DecodedSubject;  
    //console.log("titulo:" + title);
    var lista = title.replace(/[|&;$%@"<>()+,?!¿¡]/g, "").toLowerCase().split(" ");
    //var lista = "hola como va, bien?".replace(/[|&;$%@"<>()+,?!¿¡]/g, "").toLowerCase().split(" ");    
    for each (var item in lista) {
        //solo palabras mayores a 4 caracteres
        if(item.length >= this.minimoTamanioPalabra && !this.palabrasIgnoradas[item]){
          this.listaPalabras[item] = this.listaPalabras[item] + 1 || 1;
        }
    }    
}

function sortMapByValue(map)
{
    var sortable = [];
    for (var palabra in map){
      if(map[palabra]>this.minimoRepeticiones ){
          sortable.push([palabra, map[palabra]]);
      }
    }        
    sortable.sort(function(a, b) {return b[1] - a[1]})
    return sortable
}
  