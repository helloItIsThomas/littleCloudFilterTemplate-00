import { sv } from "./variables.js";
import { handleMultFiles } from "./eventHandlers.js";

export function createInput() {
  console.log("• Running createInput() •");
  if (sv.inputElement) sv.inputElement.remove();
  let canUploadMultiple = false;
  if (!sv.params.showSingleImgMode) canUploadMultiple = true;
  sv.inputElement = sv.p.createFileInput(function (_file) {
    const totalUploadNum = sv.inputElement.elt.files.length;
    sv.tempUploadFiles.push(_file);
    if (sv.tempUploadFiles.length === totalUploadNum) {
      handleMultFiles(sv.p, totalUploadNum);
      sv.tempUploadFiles = [];
    }
  }, canUploadMultiple);
  sv.inputElement.id("image-input");
  console.log(canUploadMultiple);
}
