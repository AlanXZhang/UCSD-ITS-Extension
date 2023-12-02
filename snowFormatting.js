(() => {
  const logging = false,
    isMacUser = navigator.userAgent.indexOf("Mac") != -1,
    confirmProposingSolution =
      localStorage["its-extension-confirm-proposing-solution"] == "1",
    log = (str) => {
      if (logging) console.log(str);
    },
    editHighlighted = function (command, selection) {
      log("in command");
      const replacements = {
        hyperlink: (() => {
          const startCode = '[code]<a href="" target="_blank">';
          return {
            startCode: startCode,
            endCode: "</a>[/code]",
            selectionEnd: startCode.indexOf('"') + 1,
          };
        })(),
        bold: {
          startCode: "[code]<b>",
          endCode: "</b>[/code]",
        },
        italic: {
          startCode: "[code]<i>",
          endCode: "</i>[/code]",
        },
        image: {
          startCode: `[code]<img src="`,
          endCode: `" width=600px />[/code]`,
        },
        orderedList: {
          startCode: "[code]\n<ol>\n<li>\n",
          endCode: "\n</li>\n</ol>\n[/code]",
        },
        unorderedList: {
          startCode: "[code]\n<ul>\n<li>\n",
          endCode: "\n</li>\n</ul>\n[/code]",
        },
        code: {
          startCode:
            "[code]<code style='display: inline-block; border: 0.5px solid #BBBBBB; border-radius: 1px; background-color: #E5E5E5; padding: 5px; margin-left: 3px; margin-right: 2px;'>",
          endCode: "</code>[/code]",
        },
        blockquote: {
          startCode:
            "[code]<blockquote style='border-left: 3px solid #00629B; padding: 1em;'>\n[/code]",
          endCode: "[code]\n</blockquote>[/code]",
        },
        listItem: {
          startCode: "<li>\n",
          endCode: "\n</li>",
        },
        paragraph: {
          startCode: "[code]<p>\n",
          endCode: "\n</p>[/code]",
        },
      };

      const textArea = selection.focusNode.querySelector("textarea,input"),
        start = textArea.selectionStart,
        end = textArea.selectionEnd,
        lastChar = textArea.value.substring(end - 1, end) === " ",
        optionalSpace = lastChar ? " " : "";

      var startCode,
        endCode,
        selectionEnd = -1;
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
          end - start > 0
            ? end + startCode.length + endCode.length
            : start + startCode.length;
      }
      const insertedText =
        startCode +
        textArea.value.substring(start, end).trim() +
        endCode +
        optionalSpace;
      document.execCommand("insertText", false, insertedText);
      setTimeout(() => {
        textArea.blur();
        textArea.focus();
      }, 10);
      textArea.selectionEnd = selectionEnd;
    },
    keyDown = (e) => {
      const selection = document.getSelection();

      log(selection);

      if ((isMacUser && e.metaKey) || (!isMacUser && e.ctrlKey)) {
        const shiftDown = e.shiftKey,
          letter = e.key.toLowerCase();

        if (letter == "x" && shiftDown == true) {
          if (
            confirm(
              "Are you sure you would like to " +
                (confirmProposingSolution ? "disable" : "enable") +
                " the confirmation dialog before proposing solution on a ticket?",
            )
          ) {
            localStorage["its-extension-confirm-proposing-solution"] =
              !confirmProposingSolution ? "1" : "0";
            alert(
              "The confirmation dialog has been " +
                (confirmProposingSolution ? "disabled" : "enabled") +
                ". Please reload the page for it to take effect.",
            );
            e.preventDefault();
            return;
          }
        }

        if (
          letter == "c" &&
          shiftDown == true &&
          NOW !== undefined &&
          NOW.sysId !== undefined
        ) {
          navigator.clipboard.writeText(NOW.sysId);
          e.preventDefault();
          return;
        }

        if (
          selection.focusNode !== selection.anchorNode ||
          selection.focusNode === undefined ||
          selection.focusNode === null ||
          selection.focusNode.nodeType === 3 ||
          !selection.focusNode.querySelector("textarea,input")
        )
          return;

        for (var command in keyCombinations) {
          const combo = keyCombinations[command],
            comboMatches = combo[0] == shiftDown && combo[1] == letter;
          if (comboMatches) {
            e.preventDefault();
            editHighlighted(command, selection);
            return;
          }
        }
      }
    },
    paste = (e) => {
      const selection = document.getSelection();
      if (
        selection.focusNode !== selection.anchorNode ||
        selection.focusNode === undefined ||
        selection.focusNode === null ||
        selection.focusNode.nodeType === 3 ||
        !selection.focusNode.querySelector("textarea")
      )
        return;

      const originalPasteText = (
        e.clipboardData || window.clipboardData
      ).getData("text");
      var pasteText = originalPasteText;
      if (
        (pasteText.includes("TECHNAME") || pasteText.includes("tech_name")) &&
        NOW !== undefined &&
        NOW.user !== undefined
      ) {
        pasteText = pasteText.replaceAll(
          /TECHNAME|tech_name/g,
          `${NOW.user.firstName} ${NOW.user.lastName}`,
        );
      }
      if (
        pasteText.includes("CASE") &&
        document.getElementById(
          "sys_readonly.sn_customerservice_case.number",
        ) !== null
      ) {
        pasteText = pasteText.replaceAll(
          /CASE/g,
          document.getElementById("sys_readonly.sn_customerservice_case.number")
            .value,
        );
      }
      if (pasteText.includes("received from: no-reply@duosecurity.com")) {
        pasteText = pasteText.replaceAll(
          /(received from: no-reply@duosecurity\.com[\n\r]+)|([\n\r]User.*\?referer=email)/g,
          "",
        );
      }
      if (
        pasteText.includes("SYSID") &&
        NOW !== undefined &&
        NOW.sysId !== undefined
      ) {
        pasteText = pasteText.replaceAll(/SYSID/g, NOW.sysId);
      }

      if (pasteText !== originalPasteText) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
        // selection.deleteFromDocument();
        // selection.getRangeAt(0).insertNode(document.createTextNode(pasteText));
        // selection.collapseToEnd();
        document.execCommand("insertText", false, pasteText);
        e.preventDefault();
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
    listItem: [false, "l"],
    paragraph: [false, "p"],
  };

  setTimeout(() => {
    window.addEventListener("keydown", keyDown);
    window.addEventListener("paste", paste);
    if (Math.floor(Math.random() * 10) === 0) {
      [].slice
        .call(
          document.querySelectorAll(
            'button[data-action-name="saveAndStayCase"]',
          ),
        )
        .forEach((button) => (button.innerText = "Save and Slay"));
    }
    if (confirmProposingSolution) {
      [].slice
        .call(
          document.querySelectorAll(
            'button[data-action-name="proposeSolution"]',
          ),
        )
        .forEach((button) => {
          button.innerText = "Propose Solution*";
          button.setAttribute(
            "onclick",
            "if(confirm('Are you sure you would like to propose solution on this case?')) " +
              button.getAttribute("onclick"),
          );
        });

      // const originalGsftSubmit = window.gsftSubmit ?? function() { };
      // window.gsftSubmit = function() {
      //   if (confirm()) {
      //     originalGsftSubmit.apply(null, arguments);
      //   }
      // };
    }
  }, 500);

  window.confirmProposingSolution = confirmProposingSolution;
})();
