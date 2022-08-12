var iconURL = chrome.runtime.getURL('copy.png');

function setupButtons() {
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

const currURL = document.URL
console.log(currURL)
console.log(currURL.indexOf("https://iam.ucsd.edu/dsasearch/dsaSearchByEmail*") > -1)
if (currURL.indexOf("https://iam.ucsd.edu/dsasearch/deptList") > -1) {
  var tableParent = document.getElementById("results");
  const observer = new MutationObserver(() => {setupButtons()});
  observer.observe(tableParent, {childList: true});
} else {
  setupButtons()
  var inputForm = document.querySelector("input");
  console.log(inputForm)
  if (inputForm) {
    inputForm.addEventListener('input', (e) => {
      var email = e.target.value
      console.log(email.toLowerCase().trim())
      inputForm.value = email.toLowerCase().trim()
      navigator.clipboard.writeText(`${email}`);
    });
  }
}
