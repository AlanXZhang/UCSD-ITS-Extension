var body = document.body
var userAgent = navigator.userAgent
var isWindows = userAgent.includes("Windows")
var isMac = userAgent.includes("Mac")

function listen() {
  window.addEventListener('keydown', function(event) {
    var functionKey;
    if (isWindows) {
      functionKey = event.ctrlKey;
    } else if (isMac) {
      functionKey = event.metaKey;
    }
    if ( // HyperLink the highlighted text or add a hyperlink eelement
      (isWindows && event.ctrlKey && event.key === 'q') ||
      (isMac && event.metaKey && event.key === 'k')
    ) { editHighlighted("hyperlink")}
    else if ( //Bolds highlighted text
      (functionKey && event.key === "b")
    ) { editHighlighted("bold") }
    else if (
      (functionKey && event.key === "i")
    ) { editHighlighted("image")}
  });
}

function editHighlighted(style) {
  var selection = window.getSelection();
  if (selection.focusNode !== selection.anchorNode) return;

  var baseNode = selection.anchorNode;
  var textArea = selection.baseNode.querySelector("textarea");

  var len = textArea.value.length;
  var start = textArea.selectionStart;
  var end = textArea.selectionEnd;

  if (style === "hyperlink") {
    var startCode = "[code]<a href=\"\">"
    var endCode = "</a>[/code] "
    textArea.value = (
      textArea.value.substring(0,start) +
      startCode +
      textArea.value.substring(start, end) +
      endCode +
      textArea.value.substring(end,len)
    );
    textArea.selectionEnd = start + startCode.indexOf("\"") + 1
  } else if (style === "bold") {
    var startCode = "[code]<b>"
    var endCode = "</b>[/code] "
    textArea.value = (
      textArea.value.substring(0,start) +
      startCode +
      textArea.value.substring(start,end).trim() +
      endCode +
      textArea.value.substring(end,len)
    );
    textArea.selectionEnd = (
      end-start > 0 ? start + startCode.length + end - start + endCode.length - 1 :
      start + startCode.length
    );
  } else if (style === "image") {
    var imgTag = `[code]<img src="${textArea.value.substring(start,end).trim()}" width=600px />[/code] `
    textArea.value = (
      textArea.value.substring(0,start) +
      imgTag +
      textArea.value.substring(end,len)
    );
    textArea.selectionEnd = end-start > 0 ? start + imgTag.length : start + imgTag.indexOf("\"") + 1
  }
  else {

  }
}

listen()