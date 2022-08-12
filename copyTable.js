export default function setupButtons(iconURL = chrome.runtime.getURL('copy.png')) {
  var tables = document.querySelectorAll('table');
  for (var table of tables) {
    var button = document.createElement('button');
    button.setAttribute("id", table.id);

    button.onclick = function(e) {
      var clipboardString = e.target.parentElement.outerHTML;
      clipboardString = clipboardString.replace(/ {4}|[\t\n\r]/gm,'');
      navigator.clipboard.writeText(`[code]${clipboardString}[/code]`);
    };

    button.setAttribute("style","display:none")
    button.setAttribute("class","table-copy");

    table.style.setProperty('--url', `url(${iconURL})`);
    table.appendChild(button);
  }
}
