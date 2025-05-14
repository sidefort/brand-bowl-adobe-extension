import {
  helloVoid,
  helloError,
  helloStr,
  helloNum,
  helloArrayStr,
  helloObj,
} from "../utils/samples";
export { helloError, helloStr, helloNum, helloArrayStr, helloObj, helloVoid };
// import { dispatchTS } from "../utils/utils";

export const alertDialog = (message: string) => {
  alert(`Brand Bowl: ${message}`);
};

export function exportFile(): string | null {
  const doc = app.activeDocument;

  const tempFile = new File(Folder.temp + '/exported_selection.svg');
  const opts = new ExportOptionsSVG();
  // @ts-expect-error
  opts.coordinatePrecision = 2;
  // @ts-expect-error
  opts.artBoardClipping = true;

  doc.exportFile(tempFile, ExportType.SVG, opts);

  // Read SVG content
  tempFile.open('r');
  const svg = tempFile.read();
  tempFile.close();
  return svg;
}

// export function exportFile(): string | null {
//   var doc = app.activeDocument;

//   // 1) Prepare export options
//   var tempFile = new File(Folder.temp.fsName + '/exported_selection.svg');
//   var opts = new ExportOptionsSVG();
//   // @ts-expect-error
//   opts.coordinatePrecision = 2;
//   // We're exporting the full artboard—hidden items simply won't appear
//   // @ts-expect-error
//   opts.artBoardClipping = true;

//   // 2) Hide all non-selected items
//   var hiddenItems = [];
//   var sel = doc.selection;
//   if (sel && sel.length) {
//     var allItems = doc.pageItems;
//     for (var i = 0; i < allItems.length; i++) {
//       var itm = allItems[i];
//       if (!itm.selected) {
//         itm.hidden = true;
//         hiddenItems.push(itm);
//       }
//     }
//   }

//   // 3) Export—only the visible (i.e. selected) artwork will be in the SVG  
//   doc.exportFile(tempFile, ExportType.SVG, opts);

//   // 4) Restore visibility
//   for (var j = 0; j < hiddenItems.length; j++) {
//     hiddenItems[j].hidden = false;
//   }

//   // 5) Read and return the SVG text
//   tempFile.open('r');
//   var svg = tempFile.read();
//   tempFile.close();
//   return svg;
// }


// export function exportFile(): string | null {
//   var doc = app.activeDocument;
//   if (app.name !== "Adobe Illustrator") {
//     return null;
//   }
//   // remember original document
//   var originalDoc = doc;

//   // require a selection
//   if (!doc.selection || doc.selection.length === 0) {
//     throw new Error('No artwork selected.');
//   }

//   // compute bounds of selection
//   var sel    = doc.selection;
//   var b0     = sel[0].visibleBounds; // [left, top, right, bottom]
//   var left   = b0[0],  top    = b0[1],
//       right  = b0[2],  bottom = b0[3];
//   for (var i = 1; i < sel.length; i++) {
//     var bi = sel[i].visibleBounds;
//     left   = Math.min(left,   bi[0]);
//     top    = Math.max(top,    bi[1]);
//     right  = Math.max(right,  bi[2]);
//     bottom = Math.min(bottom, bi[3]);
//   }

//   var padding = 10;
//   var width   = right  - left;
//   var height  = top    - bottom;

//   // prepare temp SVG file & export options
//   var tempFile = new File(Folder.temp.fsName + '/exported_selection.svg');
//   var opts = new ExportOptionsSVG();
//   // @ts-expect-error
//   opts.coordinatePrecision = 2;
//   // @ts-expect-error
//   opts.artBoardClipping = true;

//   // create a temp doc sized to selection + padding
//   var tempDoc = app.documents.add(
//     DocumentColorSpace.RGB,
//     width  + padding * 2,
//     height + padding * 2
//   );
//   tempDoc.artboards[0].artboardRect = [
//     0,
//     height + padding * 2,
//     width  + padding * 2,
//     0
//   ];

//   // duplicate & reposition selection into tempDoc
//   for (var j = 0; j < sel.length; j++) {
//     // @ts-expect-error
//     var item = sel[j].duplicate(tempDoc, ElementPlacement.PLACEATEND);
//     item.translate(
//       -left   + padding,
//       -bottom + padding
//     );
//   }

//   // export tempDoc — Illustrator will open the SVG as a new doc
//   tempDoc.exportFile(tempFile, ExportType.SVG, opts);
//   // close the tempDoc we created
//   tempDoc.close(SaveOptions.DONOTSAVECHANGES);

//   // close the newly opened SVG export so the original stays open
//   for (var k = 0; k < app.documents.length; k++) {
//     var d = app.documents[k];
//     if (d.name === tempFile.name) {
//       d.close(SaveOptions.DONOTSAVECHANGES);
//       break;
//     }
//   }

//   // reactivate our original document
//   originalDoc.activate();

//   // read & return the SVG contents
//   tempFile.open('r');
//   var svg = tempFile.read();
//   tempFile.close();
//   return svg;
// }

export function placeSVGInArtboard(svgText: string): string {
  if (!svgText) {
    throw new Error('SVG text is required.');
  }

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

  const placedItem = doc.placedItems.add();
    placedItem.file = f;

    try {
      placedItem.embed();
    } catch (_) {
    }

  // move to top‐left of artboard
  placedItem.position = [0, doc.height];
  return 'Image placed successfully.';
}