(() => {
  const logging = true,
    isMacUser = navigator.userAgent.indexOf("Mac") != -1,
    log = (str) => {
      if (logging) console.log(str);
    },
    editHighlighted = function(command, selection) {
      console.log("in command");
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
        },
        paragraph: {
          startCode: "[code]<p>\n",
          endCode: "\n</p>[/code]"
        }
      };

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
      document.execCommand("insertText", false, insertedText);
      setTimeout(() => {
        textArea.blur()
        textArea.focus()
      }, 10);
      textArea.selectionEnd = selectionEnd;
    },
    keyDown = (e) => {
      const selection = document.getSelection();

      console.log(selection);

      if (
        selection.focusNode !== selection.anchorNode ||
        selection.focusNode === null ||
        !selection.focusNode.querySelector("textarea,input")
      ) return true;

      if (
        (isMacUser && e.metaKey) ||
        (!isMacUser && e.ctrlKey)
      ) {
        const shiftDown = e.shiftKey,
          letter = e.key.toLowerCase();
        for (var command in keyCombinations) {
          const combo = keyCombinations[command],
            comboMatches = combo[0] == shiftDown && combo[1] == letter;
          if (comboMatches) {
            e.preventDefault();
            editHighlighted(command, selection);
          }

        }
      }
    };

  //[shift, letter]
  var keyCombinations = {
    hyperlink: [false, isMacUser ? "k" : "q"],
    bold: [false, "b"],
    italic: [false, "i"],
    image: [true, "i"],
    orderedList: [false, "o"],
    unorderedList: [false, "u"],
    code: [true, "c"],
    blockquote: [true, "b"],
    listItem: [true, "l"],
    paragraph: [false, "p"]
  }

  setTimeout(() => window.addEventListener("keydown", keyDown), 1000);

  console.log("i'm here")

})();
