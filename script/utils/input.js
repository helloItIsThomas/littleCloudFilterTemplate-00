import { sv } from "./variables.js";
import { handleMultFiles } from "./eventHandlers.js";

export function createInput() {
  // console.log("• Running createInput() •");
  if (sv.inputElement) sv.inputElement.remove();
  sv.inputElement = sv.p.createFileInput(function (_file) {
    sv.totalUploadNum = sv.inputElement.elt.files.length;
    if (sv.totalUploadNum > 1) {
      sv.currentlyMoreThanOneImage = true;
      sv.advanced.show();
    } else {
      sv.currentlyMoreThanOneImage = false;
      sv.advanced.hide();
    }
    sv.tempUploadFiles.push(_file);
    if (sv.tempUploadFiles.length === sv.totalUploadNum) {
      console.log("running handleMultFiles from createInput");
      handleMultFiles(sv.p);
      sv.tempUploadFiles = [];
    }
  }, true);
  sv.inputElement.id("image-input");
  const guiBottom = document.getElementById("guiBottom");
  sv.inputElement.parent(guiBottom);
}
