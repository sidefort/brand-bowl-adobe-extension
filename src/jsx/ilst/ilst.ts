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

  return null;
}

export function placeSVGInArtboard(svgText: string): string {
  const tempFolder = Folder.temp.fsName;
  const svgFile = new File(tempFolder + '/downloaded.svg');
  svgFile.encoding = 'UTF-8';
  svgFile.open('w');
  svgFile.write(svgText);
  svgFile.close();

  if (app.documents.length === 0) {
    throw new Error('No open document to place into.');
  }

  const doc = app.activeDocument;

  // @ts-expect-error
  const svgGroup = doc.groupItems.createFromFile(svgFile);
  
  // position at top-left of artboard (AI’s origin is lower-left)
  svgGroup.position = [0, doc.height];
  return 'SVG placed successfully.';
};

export function placeImageInArtboard(fileName: string, fileData: string) {
  if (!fileName || !fileData) {
    throw new Error('File name and data are required.');
  }

  // write temp file
  const tmpPath = Folder.temp.fsName + '/' + fileName;
  const f = new File(tmpPath);
  f.encoding = 'BINARY';
  if (!f.open('w')) {
    throw new Error('Cannot open ' + f.fsName);
  }
  f.write(fileData);
  f.close();

  if (app.documents.length === 0) {
    throw new Error('No open document.');
  }
  const doc = app.activeDocument;


  // const imageGroup = doc.groupItems.createFromFile(f);

  const placedItem = doc.placedItems.add();
    placedItem.file = f;
    // embed it so it isn’t just a link
    try {
      placedItem.embed();
    } catch (_) {
      // some formats/versions may not support embed(); ignore
    }

  // move to top‐left of artboard
  placedItem.position = [0, doc.height];
  return 'Image placed successfully.';
}