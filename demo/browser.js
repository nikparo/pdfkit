var PDFDocument = require('../');
// var PDFDocument = require('../js/document');
var saveAs = require('file-saver').saveAs;

var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;\nMauris at ante tellus. Vestibulum a metus lectus. Praesent tempor purus a lacus blandit eget gravida ante hendrerit. Cras et eros metus. Sed commodo malesuada eros, vitae interdum augue semper quis. Fusce id magna nunc. Curabitur sollicitudin placerat semper. Cras et mi neque, a dignissim risus. Nulla venenatis porta lacus, vel rhoncus lectus tempor vitae. Duis sagittis venenatis rutrum. Curabitur tempor massa tortor.';

const OpenSans = 'Open Sans';
const OpenSansBold = 'Open Sans Bold';
const fonts = [
  {
    name: OpenSans,
    // url: '/fonts/OpenSans-Regular.ttf',
    url: 'https://fonts.gstatic.com/s/opensans/v14/cJZKeOuBrn4kERxqtaUH3bO3LdcAZYWl9Si6vvxL-qU.woff',
  },
  // {
  //   name: OpenSansBold,
  //   url: '/fonts/OpenSans-Regular.ttf',
  // },
];
// const OPEN_SANS_WOFF = 'https://fonts.gstatic.com/s/opensans/v14/cJZKeOuBrn4kERxqtaUH3bO3LdcAZYWl9Si6vvxL-qU.woff';
// const OPEN_SANS_WOFF2 = 'https://fonts.gstatic.com/s/opensans/v14/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2';

fonts.forEach(function(font) {
  fetch(font.url).then(function(file) {
    file.arrayBuffer().then(function(buffer) {
      font.buffer = buffer;
    });
  });
});

// function registerFonts(doc, fonts) {
//   const promises = fonts.map(function(font) {
//     return fetch(font.url).then(function(file) {
//       return file.arrayBuffer().then(function(buffer) {
//         doc.registerFont(font.name, buffer);
//       });
//     });
//   });
//   return Promise.all(promises);
// };

function formatDate(date) {
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
}

function makePDF(PDFDocument, lorem) {
  // create a document and pipe to a blob
  var doc = new PDFDocument();
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  // await registerFonts(doc, fonts);
  fonts.forEach(function(font) {
    doc.registerFont(font.name, font.buffer);
  });
  // draw some text
  // doc.fontSize(25)
  doc.font(OpenSans)
  // doc.font('Helvetica')
     .fontSize(25)
     .text('Here is some vector graphics...', 100, 80);
     
  // some vector graphics
  doc.save()
     .moveTo(100, 150)
     .lineTo(100, 250)
     .lineTo(200, 250)
     .fill("#FF3300");
     
  doc.circle(280, 200, 50)
     .fill("#6600FF");
     
  // an SVG path
  doc.scale(0.6)
     .translate(470, 130)
     .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
     .fill('red', 'even-odd')
     .restore();
     
  // and some justified text wrapped into columns
  doc.text('And here is some wrapped text...', 100, 300)
    //  .font('Times-Roman', 13)
     .fontSize(13)
     .moveDown()
     .text(lorem, {
       width: 412,
       align: 'justify',
       indent: 30,
       columns: 2,
       height: 300,
       ellipsis: true
     });

  // end and download the document
  doc.on('end', function() {
    const blob = new Blob(buffers.map(function(buffer) { return buffer.toArrayBuffer() }), {type: 'application/pdf'});
    // const URL = global.URL || global.webkitURL || global.mozURL;
    // iframe.src = URL.createObjectURL(pdfData);
    saveAs(blob, 'test-pdf_'+formatDate(new Date()));
  });
  doc.end();
}

function download() {
  console.log('download');
  makePDF(PDFDocument, lorem);
}
const button = document.getElementById('download-button');
button.addEventListener('click', download, false);

setTimeout(function(){
  console.log(fonts.map(function(font){ return font.buffer }));
  makePDF(PDFDocument, lorem);
}, 1000);
