const vscode = require('vscode');

const axios = require('axios').default;

function GetrandomAyaNumber() {

	const ayatMinimumFromNumber = 1;

	const ayatMaximumAtNumber = 6236

	return Math.floor(Math.random() * (ayatMaximumAtNumber - ayatMinimumFromNumber + 1)) + ayatMinimumFromNumber;
}

function getUserlanguage()
{
	let lang = 'ar';
	
	if(vscode.workspace.getConfiguration("ayat").get('language') === 'Arabic')
	{
		return lang;
	}else
	{
		  lang = 'en'; 
	}

	return lang;
}

async function getRandomAya()
{
	randomAyaNumber = GetrandomAyaNumber();

	let content = "";

	try {

		let ayalanguage = getUserlanguage();

		response = await axios.get(`http://api.alquran.cloud/v1/ayah/${randomAyaNumber}/${ayalanguage}.asad`)

		let aya = response.data.data.text;

		let ayaNumber = response.data.data.numberInSurah;

		let surahName = response.data.data.surah.name

		content = `${aya}✨
	  ${surahName} (${ayaNumber})
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

		// autostarted when vscode is up
	
		let repeatedEveryMinute = vscode.workspace.getConfiguration("ayat").get('repeatedEveryMinute');
		
		let convertMinutetoMs = repeatedEveryMinute * 60000;

		setInterval( async function(){

			getRandomAya().then(function(response){
				vscode.window.showInformationMessage(response, 'X');
			}).catch(function(error){
			vscode.window.showInformationMessage('Error while activating Ayat :( ');
			});

		},convertMinutetoMs);

}

 function deactivate() {}

module.exports = {
	activate,
	deactivate
}

