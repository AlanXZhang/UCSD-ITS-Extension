(() => {
  var editHighlighted = (style) => {
    var doc =
      document.getElementById("gsft_main")?.contentWindow?.document ??
      document;

    var selection = doc.getSelection();
    if (selection.focusNode !== selection.anchorNode) return;

    var textArea = selection.focusNode.querySelector("textarea");

    var len = textArea.value.length;
    var start = textArea.selectionStart;
    var end = textArea.selectionEnd;
    var lastChar = textArea.value.substring(end - 1, end) === " "
    var optionalSpace = lastChar ? " " : ""
    var startCode, endCode;
    var selectionEnd = -1;

    if (style === "hyperlink") {
      startCode = '[code]<a href="">';
      endCode = '</a>[/code]';
      selectionEnd = start + startCode.indexOf('"') + 1;
    } else if (style === "miniHyperlink") {
      startCode = '<a href="';
      endCode = '"></a>';
    } else if (style === "bold") {
      startCode = "[code]<b>";
      endCode = "</b>[/code]";
    } else if (style === "italic") {
      startCode = "[code]<i>";
      endCode = "</i>[/code]";
    } else if (style === "image") {
      startCode = `[code]<img src="`;
      endCode = `" width=600px />[/code]`;
    } else if (style === "miniImage") {
      startCode = `<img src="`;
      endCode = `" width=600px />`;
    } else if (style === "orderedList") {
      startCode = "[code]\n<ol>\n<li>\n";
      endCode = "\n</li>\n</ol>\n[/code]";
    } else if (style === "unorderedList") {
      startCode = "[code]\n<ul>\n<li>\n";
      endCode = "\n</li>\n</ul>\n[/code]";
    } else if (style === "code") {
      startCode = "[code]<code style='display: inline-block; border: 0.5px solid #BBBBBB; border-radius: 1px; background-color: #E5E5E5; padding: 5px; margin-left: 3px; margin-right: 2px;'>";
      endCode = "</code>[/code]";
    } else if (style === "miniCode") {
      startCode = "<code style='display: inline-block; border: 0.5px solid #BBBBBB; border-radius: 1px; background-color: #E5E5E5; padding: 5px; margin-left: 3px; margin-right: 2px;'>";
      endCode = "</code>";
    } else if (style === "blockquote") {
      startCode = "[code]<blockquote style='border-left: 3px solid #00629B; padding: 1em;'>\n<p style='white-space: pre-wrap; margin: 0;'>";
      endCode = "</p>\n</blockquote>[/code]";
    } else if (style === "listItem") {
      startCode = "<li>\n";
      endCode = "\n</li>";
    }
    if (selectionEnd === -1) {
      selectionEnd =
        end - start > 0 ?
        end + startCode.length + endCode.length :
        start + startCode.length;
    }
    textArea.value =
      textArea.value.substring(0, start) +
      startCode +
      textArea.value.substring(start, end).trim() +
      endCode +
      optionalSpace +
      textArea.value.substring(end, len);
    textArea.blur()
    textArea.focus()
    textArea.selectionEnd = selectionEnd;
  };

  chrome.commands.onCommand.addListener((command, tab) => {
    if (
      tab === undefined ||
      tab.url === undefined ||
      (!tab.url.startsWith("https://support.ucsd.edu/") &&
        !tab.url.startsWith("https://snqa.ucsd.edu/"))
    ) {
      return;
    }

    chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      function: editHighlighted,
      args: [command],
    });
  });
})();
