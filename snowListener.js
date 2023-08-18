(() => {
  editHighlighted = (command) => {

    const replacements = {
      hyperlink: (() => {
        const startCode = '[code]<a href="" target="_blank">';
        return {
          startCode: startCode,
          endCode: '</a>[/code]',
          selectionEnd: startCode.indexOf('"') + 1
        };
      })(),
      bold: {
        startCode: "[code]<b>",
        endCode: "</b>[/code]"
      },
      italic: {
        startCode: "[code]<i>",
        endCode: "</i>[/code]"
      },
      image: {
        startCode: `[code]<img src="`,
        endCode: `" width=600px />[/code]`
      },
      orderedList: {
        startCode: "[code]\n<ol>\n<li>\n",
        endCode: "\n</li>\n</ol>\n[/code]"
      },
      unorderedList: {
        startCode: "[code]\n<ul>\n<li>\n",
        endCode: "\n</li>\n</ul>\n[/code]"
      },
      code: {
        startCode: "[code]<code style='display: inline-block; border: 0.5px solid #BBBBBB; border-radius: 1px; background-color: #E5E5E5; padding: 5px; margin-left: 3px; margin-right: 2px;'>",
        endCode: "</code>[/code]"
      },
      blockquote: {
        startCode: "[code]<blockquote style='border-left: 3px solid #00629B; padding: 1em;'>\n[/code]",
        endCode: "[code]\n</blockquote>[/code]"
      },
      listItem: {
        startCode: "<li>\n",
        endCode: "\n</li>"
      }
    }, doc =
        document.getElementById("gsft_main")?.contentWindow?.document ??
        document,
      selection = doc.getSelection();

    if (selection.focusNode !== selection.anchorNode || selection.focusNode === null || !selection.focusNode.querySelector("textarea,input")) return;

    const textArea = selection.focusNode.querySelector("textarea,input"),
      start = textArea.selectionStart,
      end = textArea.selectionEnd,
      lastChar = textArea.value.substring(end - 1, end) === " ",
      optionalSpace = lastChar ? " " : "";

    var startCode, endCode, selectionEnd = -1;
    if (!Object.keys(replacements).includes(command)) {
      return;
    }

    const replacement = replacements[command];
    startCode = replacement.startCode;
    endCode = replacement.endCode;

    if (Object.keys(replacement).includes("selectionEnd")) {
      selectionEnd = start + replacement.selectionEnd;
    } else {
      selectionEnd =
        end - start > 0 ?
          end + startCode.length + endCode.length :
          start + startCode.length;
    }
    const insertedText = startCode +
      textArea.value.substring(start, end).trim() +
      endCode +
      optionalSpace;
    doc.execCommand("insertText", false, insertedText);
    setTimeout(() => {
      textArea.blur()
      textArea.focus()
    }, 10);
    textArea.selectionEnd = selectionEnd;
  };

  chrome.commands.onCommand.addListener((command, tab) => {
    if (
      tab === undefined ||
      tab.url === undefined ||
      (!tab.url.startsWith("https://support.ucsd.edu/") &&
        !tab.url.startsWith("https://snqa.ucsd.edu/"))
    ) {
      return true;
    }
    chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      function: editHighlighted,
      args: [command],
    });
    return true;
  });
})();
