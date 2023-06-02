const vscode = require("vscode");

const axios = require("axios").default;

function GetrandomAyaNumber() {
  const ayatMinimumFromNumber = 1;

  const ayatMaximumAtNumber = 6236;

  return (
    Math.floor(
      Math.random() * (ayatMaximumAtNumber - ayatMinimumFromNumber + 1)
    ) + ayatMinimumFromNumber
  );
}

function getUserLanguage() {
  return vscode.workspace.getConfiguration("ayat").get("language") === "Arabic"
    ? "ar"
    : "en";
}

async function getRandomAya() {
  let randomAyaNumber = GetrandomAyaNumber();

  let content = "";

  try {
    let ayalanguage = getUserLanguage();

    let response = await axios.get(
      `http://api.alquran.cloud/v1/ayah/${randomAyaNumber}/${ayalanguage}.asad`
    );

    let aya = response.data.data.text;

    if (vscode.workspace.getConfiguration("ayat").get("getSuraName") === true) {
      let ayaNumber = response.data.data.numberInSurah;
      let surahName = response.data.data.surah.name;
      content = `${aya}✨
	  ${surahName} (${ayaNumber})
		`;
    } else {
      content = aya;
    }
  } catch (error) {
    content = `✨لا إله إلا أنت سبحانك إني كنت من الظالمين
		🔴 غير متصل بالشبكة  `;
  }

  return content;
}

function activate() {
  let repeatedEveryMinute = vscode.workspace
    .getConfiguration("ayat")
    .get("repeatedEveryMinute");

  let convertMinuteToMs = repeatedEveryMinute * 60000;

  setInterval(async function () {
    getRandomAya()
      .then(function (response) {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: response,
            cancellable: true,
          },
          async (progress) => {
            progress.report({ increment: 0 });
            await new Promise((resolve) =>
              setTimeout(resolve, convertMinuteToMs)
            );
            progress.report({ increment: 100, message: "Done!" });
          }
        );
      })
      .catch(function () {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Error while activating Ayat :( ",
            cancellable: true,
          },
          async (progress) => {
            progress.report({ increment: 0 });
            await new Promise((resolve) =>
              setTimeout(resolve, convertMinuteToMs)
            );
            progress.report({ increment: 100, message: "Done!" });
          }
        );
      });
  }, convertMinuteToMs);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
