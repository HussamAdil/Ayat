const vscode = require('vscode');

const axios = require('axios').default;

const azkar = require('./azkar')

function GetrandomAyaNumber() {
	  
	const ayatMinimumFromNumber = 1;
	
	const ayatMaximumAtNumber = 6236

	return GetrandomNumber(ayatMinimumFromNumber,ayatMaximumAtNumber)
}

function GetrandomNumber(min,max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function getRandomAya()
{
	randomAyaNumber = GetrandomAyaNumber();

	let content = "";
			
	try {

		response = await axios.get(`http://api.alquran.cloud/v1/ayah/${randomAyaNumber}/ar.asad`)
		
		let aya = response.data.data.text;

		let ayaNumber = response.data.data.numberInSurah;

		let surahName = response.data.data.surah.name 

		content = `✨${aya}✨ 
	💚 ${surahName} (${ayaNumber})
		` ;
	} catch (error) {
		content = `✨لا إله إلا أنت سبحانك إني كنت من الظالمين
	
		🔴 غير متصل بالشبكة  `
	}

	return content;
} 

/**
 * @param {vscode.ExtensionContext} context
 */ 
function activate(context) {
		
		context.subscriptions.push(vscode.commands.registerCommand('ayat.getAya',async function () {
			 
			getRandomAya().then(function(response){
				vscode.window.showInformationMessage(response);
			}).catch(() => {
				vscode.window.showInformationMessage('Error while activating Ayat :( ');
			});

		}));	

		context.subscriptions.push(vscode.commands.registerCommand('ayat.getZekr',async function () {
			const content =  getRandomAthkar();
			vscode.window.showInformationMessage(content);
		}));	

		// autostarted when vscode is up 
		
		let repeatedEveryMinute = vscode.workspace.getConfiguration("ayat").get('repeatedEveryMinute');
				
		let convertMinutetoMs = repeatedEveryMinute * 60000;
 
		setInterval( async function(){

			getRandomAya().then(function(response){
				vscode.window.showInformationMessage(response);
			}).catch(function(error){ 
			vscode.window.showInformationMessage('Error while activating Ayat :( ');
			});
			 
		},convertMinutetoMs);
		
}


function getRandomAthkar(){
	const hour = new Date().getHours();
	const index = hour > 12 ? 1 : 0;
	const azkarArr = azkar[index].content
	const random = GetrandomNumber(0,azkarArr.length-1)
	const zekr = azkarArr[random]
	return `✨${zekr.zekr}✨\n(repeat ${zekr.repeat} times)`
}

 function deactivate() {}

module.exports = {
	activate,
	deactivate
}

