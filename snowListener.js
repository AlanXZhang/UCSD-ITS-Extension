function editHighlighted(style) {
    var doc =
        document.getElementById("gsft_main")?.contentWindow?.document ??
        document;

    var selection = doc.getSelection();
    if (selection.focusNode !== selection.anchorNode) return;

    var textArea = selection.focusNode.querySelector("textarea");

    var len = textArea.value.length;
    var start = textArea.selectionStart;
    var end = textArea.selectionEnd;
    var lastChar = textArea.value.substring(end-1,end) === " "
    var optionalSpace = lastChar ? " " : ""
    var startCode, endCode, selectionEnd;

    if (style === "hyperlink") {
        startCode = '[code]<a href="">';
        endCode = "</a>[/code]";
        selectionEnd = start + startCode.indexOf('"') + 1;
    } else if (style === "bold") {
        startCode = "[code]<strong>";
        endCode = "</strong>[/code]";
        selectionEnd =
            end - start > 0
                ? end + startCode.length + endCode.length
                : start + startCode.length;
    } else if (style === "image") {
        startCode = `[code]<img src="`;
        endCode = `" width=600px />[/code]`;
        selectionEnd =
            end - start > 0
                ? end + startCode.length + endCode.length
                : start + startCode.length;
    }
    textArea.value =
        textArea.value.substring(0, start) +
        startCode +
        textArea.value.substring(start, end).trim() +
        endCode +
        optionalSpace +
        textArea.value.substring(end, len);
    textArea.selectionEnd = selectionEnd;
}

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
        target: { tabId: tab.id },
        function: editHighlighted,
        args: [command],
    });
});
