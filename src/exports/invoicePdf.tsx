import {Page, View, renderToString} from "@react-pdf/renderer";

const styles:any = {
  "page": {
    fontFamily: 'Arial',
    fontSize: 11,
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  supplier: {
    flex: 1,
  },
  body: {
    margin: '0',
    fontSize: '11px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    maxWidth: '720px',
  },
  h1: {
    margin: '0',
    fontSize: '16px',
  },
  '#header': {
    width: '100%',
    height: '170px',
    position: 'relative',
  },
  '#client': {
    maxWidth: '250px',
    width: '100%',
    position: 'absolute',
    top: '10px',
    right: '0',
    backgroundColor: '#f0f0f0',
    margin: '0',
    padding: '5px',
  },
  '#supplier': {
    maxWidth: '250px',
    width: '100%',
    position: 'absolute',
    top: '10px',
    left: '0',
    backgroundColor: '#f0f0f0',
    margin: '0',
    padding: '5px',
  },
  '#invoice_w': {
    maxWidth: '180px',
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '270px',
    margin: '0',
  },
  '#logo': {
    textAlign: 'center',
  },
  '#invoice': {
    marginTop: '10px',
    backgroundColor: '#404040',
    padding: '5px',
    color: 'white',
  },
  '#invoice p': {
    margin: '2px 0',
    padding: '0',
    textAlign: 'center',
  },
  '#products': {
    fontSize: '10px',
    width: '100%',
  },
  '#products th': {
    verticalAlign: 'middle',
    backgroundColor: '#404040',
    color: 'white',
  },
  '#products th, td': {
    padding: '2px',
  },
};

const PdfTemplate = ({ worder }) => {
  const { _order, /* Add other properties from worder here */ } = worder;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {_order.currency === 'EUR' ? (
            <View style={styles.supplier}>
              <Text>SELLER</Text>
              <Text>Name: SC ROMSCENT TRADING SRL</Text>
              <Text>C.I.F.: RO41041717</Text>
              <Text>Address: 287 Theodor Pallady, Bucharest</Text>
              <Text>Banca: ALPHA BANK</Text>
              <Text>IBAN: RO10 BUCU 1181 3042 5338 5EUR</Text>
              <Text>SWIFT: BUCUROBU</Text>
            </View>
          ) : (
            <View style={styles.supplier}>
              <Text>FURNIZOR</Text>
              <Text>Nume: SC ROMSCENT TRADING SRL</Text>
              <Text>Capital Social: 45.000 lei</Text>
              <Text>C.I.F.: RO41041717 | Nr. R.C.: J40/5776/2019</Text>
              <Text>Sediu: Str.Everest, Nr.10, Cam.1, Sec.3, Buc</Text>
              <Text>Pct. luc.: Theodor Pallady 287, Sec.3, Buc</Text>
              <Text>Banca: ALPHA BANK</Text>
              <Text>IBAN: RO17 BUCU 1181 3042 5338 4RON</Text>
            </View>
          )}
          {/* Add the rest of the header details here... */}
        </View>
        {/* Add the rest of the PDF content using Text, View, Image components, etc. */}
      </Page>
    </Document>
  );
};

module.exports = (worder) => {
  const pdfString = renderToString(<PdfTemplate worder={worder} />);
  return pdfString;
};

