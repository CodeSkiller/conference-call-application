import Tooltip from "@mui/material/Tooltip";

export const CustomTooltip = ( props ) => {
    return <Tooltip {...props}>
        {props.children}
    </Tooltip>
};


export default CustomTooltip;