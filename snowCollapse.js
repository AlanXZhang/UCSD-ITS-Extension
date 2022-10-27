(() => {
  var doc =
    document.getElementById("gsft_main")?.contentWindow?.document ??
    document;

  if (doc !== document) {
    var observer = new MutationObserver((mutationList) => {
      var doc =
        document.getElementById("gsft_main")?.contentWindow?.document ??
        document;
      var textBlocks = [].slice.call(doc.querySelectorAll('span.sn-widget-textblock-body.sn-widget-textblock-body_formatted'))
      textBlocks.forEach((block) => {
        var lines = block.innerHTML.split("<br>"),
          collections = [],
          i = 0
        lines.forEach((line) => {
          if (line.trim().slice(0, 4) == '&gt;') {
            if (collections[i] == undefined) {
              collections[i] = []
            }
            collections[i].push(line);
          } else {
            i += 1;
            collections[i] = [];
            collections[i].push(line)
          }
        });
        block.innerHTML = collections.map(
          (collection) => collection.length == 1 ? collection[0] :
          "<details><summary>" + collection[0] + "</summary>" +
          "<p>" + collection.slice(1).join("</p><p>") + "</p></details>").join('<br>')
      })
    });
  } else {
    var textBlocks = [].slice.call(doc.querySelectorAll('span.sn-widget-textblock-body.sn-widget-textblock-body_formatted'))
    textBlocks.forEach((block) => {
      var lines = block.innerHTML.split("<br>"),
        collections = [],
        i = 0
      lines.forEach((line) => {
        if (line.trim().slice(0, 4) == '&gt;') {
          if (collections[i] == undefined) {
            collections[i] = []
          }
          collections[i].push(line);
        } else {
          i += 1;
          collections[i] = [];
          collections[i].push(line)
        }
      });
      block.innerHTML = collections.map(
        (collection) => collection.length == 1 ? collection[0] :
        "<details><summary>" + collection[0] + "</summary>" +
        "<p>" + collection.slice(1).join("</p><p>") + "</p></details>").join('<br>')
    })
  }


})();
