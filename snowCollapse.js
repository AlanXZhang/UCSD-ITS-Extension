(() => {
  var doc =
    document.getElementById("gsft_main")?.contentWindow?.document ??
    document;

  var snowCollapse = () => {
    var doc =
      document.getElementById("gsft_main")?.contentWindow?.document ??
      document;
    var textBlocks = [].slice.call(doc.querySelectorAll('span.sn-widget-textblock-body.sn-widget-textblock-body_formatted'))
    textBlocks.forEach((block) => {
      var lines = block.innerHTML.split("<br>"),
        outputText = "",
        i = -1,
        inCollection = false;
      lines.forEach((line) => {
        if (inCollection) {
          if (line.trim().slice(0, 4) != '&gt;') {
            inCollection = false;
            outputText += '</p></details></blockquote><br/>' + line + "<br/>";
            return;
          }
          outputText += "<p>" + line + "</p>";
          return;
        }
        if (line.trim().slice(0, 4) == '&gt;') {
          inCollection = true;
          outputText += "<blockquote style='font-size: 12px'><details>";
          outputText += "<summary style='text-decoration:underline; cursor:pointer'>Collapsed Quote</summary>";
          outputText += '<p>' + line + '</p>';
          return;
        }
        outputText += line + '<br/>'
      });
      if (outputText.slice(-5) == '<br/>') {outputText = outputText.slice(0, -5)}
      block.innerHTML = outputText;
    });
  }

  if (doc !== document) {
    var observer = new MutationObserver((mutationList) => {
      snowCollapse();
    });
    observer.observe(document.getElementById('gsft_main'), {
      attributes: true
    })
  } else {
    snowCollapse();
  }


})();
