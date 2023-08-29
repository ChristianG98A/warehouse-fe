'use client'

import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";

const ProductPage = ({params}: {params: {productId: string}}) => {
    const productId = parseInt(params.productId);
    console.log(productId)

        return(
        <>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Produse",
                        path: "/produse",
                    },
                    {
                        name: "Lista Produse",
                        path: "/produse/lista_produse",
                    },
                    {
                        name: "Lista Produse",
                        path: `/produse/lista_produse/${productId}`,
                    },
                ]}
            />
         hey
        </>
        )
    }

    export default ProductPage;
