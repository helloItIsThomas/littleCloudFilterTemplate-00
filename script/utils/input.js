import { sv } from "./variables.js";
import { handleImgInputAtRuntime } from "./eventHandlers.js";

export function createInput() {
  // console.log("• Running createInput() •");
  if (sv.inputElement) sv.inputElement.remove();
  sv.inputElement = sv.p.createFileInput(function (_file) {
    sv.totalUploadNum = sv.inputElement.elt.files.length;

    sv.tempUploadFiles.push(_file);
    if (sv.tempUploadFiles.length === sv.totalUploadNum) {
      console.log("running handleImgInputAtRuntime from createInput");
      handleImgInputAtRuntime(sv.p);
      sv.tempUploadFiles = [];
    }
  }, true);
  sv.inputElement.id("image-input");
  const guiBottom = document.getElementById("guiBottom");
  sv.inputElement.parent(guiBottom);
}
