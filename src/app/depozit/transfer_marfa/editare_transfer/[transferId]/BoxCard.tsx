import {Card, CardActionArea, CardContent, Typography} from "@mui/material";

const BoxCard = (props:any)=>{
    return (
        <Card elevation={3}>
            <CardActionArea>
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
