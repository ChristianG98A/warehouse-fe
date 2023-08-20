import {pListApiResponse} from "@/model/orders/OrderTypes";
import {Page, Text, Document, StyleSheet, Link, Font, View} from "@react-pdf/renderer";

export interface PDFFileDetails {
    pListApiResponse: pListApiResponse;
}

export const PDFFile: React.FC<PDFFileDetails> = (props: PDFFileDetails) => {
    Font.register({family: 'Arial', fonts:[], fontWeight:"bold"} );
    //const data = props.pListApiResponse.response;
    const data = {
    status: 200,
    code: "success",
    response: {
        currency: "EUR",
        orderProducts: [
            {
                name: "Aparat de ras scamele, Esperanza Cuddly",
                sku: "ESPERANZAECS003T",
                ean: "7890004772037",
                quantity: "2",
                price_brutto: "100"
            },
            {
                name: "Aparat de ras scamele, Esperanza Cuddly",
                sku: "ESPERANZAECS003T",
                ean: "7890004772037",
                quantity: "2",
                price_brutto: "100"
            }
        ]
    }
}




    const styles = StyleSheet.create({
        body: {
            margin: "10%",
            fontSize: "11px",
            //fontFamily: "Arial, Helvetica, sans-serif",
            maxWidth: "720px",
        },
        supplier: {
            maxWidth: "250px",
            width: "100%",
            position: "absolute",
            top: "10px",
            left: 0,
            backgroundColor: "#f0f0f0",
            margin: 0,
            padding: "5px",
        },
        h1: {
            margin: 0,
            fontSize: "16px",
        },
        header: {
            width: "100%",
            height: "170px",
            position: "relative",
        },
        title: {
            fontSize: 24,
            textAlign: "center",
            fontWeight: 400,
        },
        text: {
            margin: 12,
            fontSize: 14,
            textAlign: "justify",
            fontFamily: "Times-Roman",
            display: "flex"
        },
        image: {
            marginVertical: 15,
            marginHorizontal: 100,
        },
        headerName: {
            fontSize: 16,
            marginBottom: 20,
            textAlign: "center",
            color: "grey",
            textTransform: "uppercase",
            fontWeight: 400,
        },
        headerInstitution: {
            fontSize: 20,
            marginBottom: 20,
            color: "grey",
            fontWeight: "ultrabold",
        },
        pageNumber: {
            position: "absolute",
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "grey",
        },
        links: {
            color: "blue"
        },
        keyword: {
            fontSize: 18,
            marginBottom: 20,
            color: "black",
            fontWeight: "ultrabold",
        },

    });

    const date = () => {
        let today: Date = new Date();
        let date: string = today.getDate() + '-' + (today.getMonth() + 1 + '-' + today.getFullYear());
        return date;
    }

    return (
        <Document>
            <Page size="A4" style={styles.body}>
            </Page>
        </Document>
    );
}
