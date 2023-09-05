import {callNextApi} from "@/helpers/apiMethods";

export default null;
export const addTransfer = async (oldWarehouseId: string, oldWarehouseName: string, newWarehouseId: string, newWarehouseName: string) => {

    const payload = {
        old_warehouse: oldWarehouseId,
        new_warehouse: newWarehouseId,
        old_warehouse_name: oldWarehouseName,
        new_warehouse_name: newWarehouseName,
    }

    console.log("Payload:", payload)

    const data = await callNextApi("POST", "/transfers/createTransfer", payload)
        .then(
            (r: any) => {
                return r;
            },
            e => console.log(e)
        );
    return data;
}

export const getTransfers = async () => {
    //setLoading(true)
    const data = await callNextApi("POST", "transfers/transfersList", {limit: 300, offset: 0})
        .then((r: any) => {
            //       console.log(r)
            //       dispatch({type: "SET_TRANSFERS", payload: r?.response})
            //       setLoading(false)
            return r
        });
    return data;
}
