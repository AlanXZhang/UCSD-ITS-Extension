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
        collections = [],
        i = -1
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

      block.innerHTML = collections.filter((collection) => collection.length >= 1).map(
        (collection) => collection.length === 1 ? collection[0] :
        "<blockquote style='font-size: 12px'><details><summary style='text-decoration:underline; cursor:pointer'>Collapsed Quote</summary>" +
        "<p>" + collection.join("</p><p>") + "</p></details></blockquote>").join('<br>');
    })
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
