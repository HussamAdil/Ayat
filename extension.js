const vscode = require('vscode');

const axios = require('axios').default;

/**
 * @param {vscode.ExtensionContext} context
 */ 
 async function activate(context) {
 		
		let repeatedEveryMinute = vscode.workspace.getConfiguration("ayat").get('repeatedEveryMinute');
				
		let convertMinutetoMs = repeatedEveryMinute * 60000;
 
		setInterval( async function(){

		randomAyaNumber = GetrandomAyaNumber();

		let content = "";

	   response = await axios.get(`http://api.alquran.cloud/v1/ayah/${randomAyaNumber}/ar.asad`).then(function (response)
	   {
		   let aya = response.data.data.text;

		   let ayaNumber = response.data.data.number;
	   
		   let surah = response.data.data.surah.name
	   
		   content = `✨ ${aya} ✨ 
	   
	   💚 ${surah} (${ayaNumber})
		   ` ;
	   }).catch(function (error) {
		   content = `✨  لا إله إلا أنت سبحانك إني كنت من الظالمين ✨

		   💚 لا تنسي ذكر الله
	   
		   🔴 غير متصل بالشبكة  `
	   });
			vscode.window.showInformationMessage(content);
		},convertMinutetoMs);
		
}

 function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function GetrandomAyaNumber() {

	ayatStartedFromNumber = 1;
	
	ayatEndAtNumber = 6236

	return Math.floor(Math.random() * (ayatEndAtNumber - ayatStartedFromNumber + 1)) + ayatStartedFromNumber;
  }