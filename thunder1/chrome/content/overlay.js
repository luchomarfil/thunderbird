Cu.import("resource:///modules/gloda/log4moz.js");

function setupLogging() {
  // The basic formatter will output lines like:
  // DATE/TIME	LoggerName	LEVEL	(log message) 
  let formatter = new Log4Moz.BasicFormatter();

  // Loggers are hierarchical, lowering this log level will affect all output
  let root = Log4Moz.repository.rootLogger;
  root.level = Log4Moz.Level["All"];

  // A console appender outputs to the JS Error Console
  let capp = new Log4Moz.ConsoleAppender(formatter);
  capp.level = Log4Moz.Level["Warn"];
  root.addAppender(capp);

  // A dump appender outputs to standard out
  let dapp = new Log4Moz.DumpAppender(formatter);
  dapp.level = Log4Moz.Level["Debug"];
  root.addAppender(dapp);
}



let logger = Log4Moz.repository.getLogger("MyExtension.MyClass");
logger.level = Log4Moz.Level["Debug"];

// Log some messages
// Given our settings, the error would show up everywhere, but the
// debug one would only show up in stdout
logger.error("Oh noes!! Something bad happened!");
logger.debug("Details about bad thing only useful during debugging");



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
		//1 Obtengo todos los asuntos de rss
		var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);  
    var accounts = acctMgr.accounts; 
		var cuentasRSS = []; 
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
							 console.log("account:"+account.incomingServer.constructedPrettyName+" folder:"+aFolder.name);
							 while( msgArray.hasMoreElements() ) {  
									 let msgHdr = msgArray.getNext().QueryInterface(Components.interfaces.nsIMsgDBHdr);  
									 let title = msgHdr.mime2DecodedSubject;  
									 // do stuff with msgHdr  
									 console.log("titulo:" + title);
							 }	
						}  
				}
		
		 }
}