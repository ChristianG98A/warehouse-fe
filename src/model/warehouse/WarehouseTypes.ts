export type WarehouseTransferOptions = {
    warehousesAllowingServicingStock: Warehouse[];
    warehouseAllowingSellingStock: Warehouse[];
}
export type Warehouse = {
    id: string;
    name: string;
}