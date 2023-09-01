
            //</Grid>

            //        <Box sx={{
            //            bgcolor: 'background.paper',
            //            boxShadow: 14,
            //            p: 4,
            //        }}>
            //        <Typography textAlign={"center"} id="new_invoice_modal" variant="h6" component="h2">
            //            Alege produse
            //        </Typography>
            //        <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flexDirection={"column"} sx={{mt: 5}}>
            //            <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
            //                <TextField
            //                    sx={{width: '30rem'}}
            //                    onChange={handleSearch}
            //                    label={'Denumire / SKU / ID'}
            //                />
            //            </ Grid>

            //            <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{width: "80%"}}>
            //                <DataGrid
            //                    //getRowId={(row) => row.id}
            //                    rowSelection={true}
            //                    columnHeaderHeight={60}
            //                    checkboxSelection
            //                    rows={state?.transferProductResult ?? []}
            //                    pageSizeOptions={[10, 25, 50]}
            //                    initialState={{pagination: {paginationModel: paginationModel}}}
            //                    onPaginationModelChange={setPaginationModel}
            //                    onRowSelectionModelChange={(newRowSelectionModel) => {
            //                        setSelectionModel(newRowSelectionModel)
            //                    }}
            //                    columns={[
            //                        {field: 'crt', headerName: 'Crt', flex: 1},
            //                        {field: 'id', headerName: 'ID Produs', flex: 1},
            //                        {field: 'name', headerName: 'Denumire Produs', flex: 4},
            //                        {field: 'model', headerName: 'Model', flex: 4},
            //                        {field: 'available_quantity', headerName: 'Cantitate Disponibila', flex: 4},
            //                        {field: 'warehouse_name', headerName: 'Depozit', flex: 4},

            //                    ]}
            //                    rowSelectionModel={selectionModel}
            //                    autoPageSize={false}
            //                    loading={loading}
            //                    sx={{minHeight: "30vh", maxHeight: "50vh"}}
            //                />
            //            </ Grid>


            //            <Grid item xs={10} sm={10} md={10} lg={10} xl={10} alignItems={"center"} justifyItems={"center"} justifyContent={"center"} >
            //                <Divider sx={{mt: 3, mb: 3}} />
            //                <Button disabled={selectionModel?.length == 0} variant="contained" onClick={() => {
            //                    setSnackBar({message: "Produse adaugate in cos!", type: 'success', state: true})
            //                    selectionModel?.forEach((itemSelected: any) => {
            //                        const checkIfProductIsInSelection = (id: any) => {
            //                            return state.transferProductSelection.some((selectedProduct: any) => selectedProduct.product_id == id)
            //                        }
            //                        console.log("is product in selection?", checkIfProductIsInSelection);
            //                        try {
            //                            if (!checkIfProductIsInSelection(itemSelected)) {
            //                               // dispatch({
            //                               //     type: "SET_TRANSFER_PRODUCT_SELECTION",
            //                               //     payload: state.productResult.find((productObject: any) => productObject.id == itemSelected)
            //                               // })
            //                            }
            //                        } catch (error) {console.log("Error in adding products to invoice!", error)}
            //                    })
            //                    setSelectionModel([])
            //                }} sx={{width: "10rem"}}>
            //                    Adauga
            //                </Button>
            //                <Button variant="contained" sx={{ml: 5}} onClick={() => dispatch({type: "SET_PRODUCT_BASKET_MODAL", payload: false})}>
            //                    Inchide
            //                </Button>
            //            </Grid>
            //        </Grid>
            //        </Box>
