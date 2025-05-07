import {
  helloVoid,
  helloError,
  helloStr,
  helloNum,
  helloArrayStr,
  helloObj,
} from "../utils/samples";
export { helloError, helloStr, helloNum, helloArrayStr, helloObj, helloVoid };
import { dispatchTS } from "../utils/utils";

export const helloWorld = () => {
  alert("Hello from Illustrator");
};

export function exportFile(): string | null {
  var doc = app.activeDocument;

  if (app.name == "Adobe Illustrator") {
      var tempFile = new File(Folder.temp + '/exported_selection.svg');
      var opts = new ExportOptionsSVG();
      // opts.coordinatePrecision = 2;

      // Export selection to a temp SVG file
      // if (!doc.selection || doc.selection.length === 0) {
          doc.exportFile(tempFile, ExportType.SVG, opts);
      // } else {
      // // Only selected artwork
      //     var originalSel = doc.selection;
      //     var tempDoc = app.documents.add(DocumentColorSpace.RGB);
      //     for (var i = 0; i < originalSel.length; i++) {
      //         originalSel[i].duplicate(tempDoc, ElementPlacement.PLACEATEND);
      //     }
      //     tempDoc.exportFile(tempFile, ExportType.SVG, opts);
      // }
      
  
      // Read SVG content
      tempFile.open('r');
      var svg = tempFile.read();
      tempFile.close();
      return svg;
  } else if (app.name == "Adobe Photoshop") {
  } else if (app.name == "Adobe InDesign") {
  }

  return null; // fallback
}