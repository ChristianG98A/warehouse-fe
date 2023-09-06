'use client'
import {StateContext} from "@/app/state/context";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";
import {green} from "@mui/material/colors";
import {useContext, useEffect} from "react";

const BoxCard = (props:{key:string|number, id:string, title:string})=>{
    const [state, dispatch]:[State, Action] = useContext(StateContext);

    return (
        <Card elevation={3}
        sx={{backgroundColor: state.selectedBox == props.id ?green[100]:null}}>
            <CardActionArea onClick={()=>dispatch({type:'SET_SELECTED_BOX', payload:props.id})}>
                <CardContent>
                    <Typography align="center" gutterBottom variant="h5" component="div">
                        {props.title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
    }
export default BoxCard;
