import React, {createContext, useState} from 'react';
import './alert.scss';


const alert = {
    show : "show-alert",
    hide : "hide-alert"
}

const defaultMessage = {
    title : "Alert",
    message : "This is alert message",
    icon : <i className="fas fa-info-circle"></i>
}

const Alert = ({
    // delay = 2000,
    show =  false,
    onShow = () => {},
    onClose = () => {},
    message = defaultMessage
}) => {
    
    // React.useEffect(() => {
    //        let timer = setTimeout(() => {
    //            onShow(false);
    //        }, delay)
    //        return () => {
    //            clearTimeout(timer);
    //        }
    // },[delay])

    return <>
    <div className={`alert-container ${show ? alert.show : alert.hide}`}>
         <h6 className="alert-title">{message.title}</h6>
         <div className="alert-body">
             <div className="alert-message">{message.message}</div>
             <div className="alert-icon">
             {message.icon}
             </div>
         </div>
    </div>
    </>
}


const AlertContext = createContext({
    show :  false,
    onAlert : () => {},
    type : "Primary",
    title : "Alert",
    message : "This is alert message",
    icon : <i className="fas fa-info-circle"></i>,
})


const {Provider : AlertProvider, Consumer : AlertConsumer} = AlertContext;

export const AlertControl = ({children, ...rest}) => {
    

    const [alertState, setAlertState] = useState({
        show : false,
        type : "Primary",
        title : "Alert",
        message : "This is alert message",
        icon : <i className="fas fa-info-circle"></i>,
    });

    const getIcon = (type) => {
        switch (type.toLowerCase()) {
            case "info": return <i className="fas fa-info-circle"></i>;
            case "success" : return <i className="fas fa-check"></i>;
            case "error" : return <i className="fas fa-times"></i>; 
            case "warn" : return <i className="fas fa-exclamation-triangle"></i>;
            default: return <i className="fas fa-info-circle"></i>;
        }
    }

    const onAlert = async ({type, title, message, delay = 10000}) => {
        const payload = {
            type,
            title,
            message,
            icon : getIcon(type),   
        }
        setAlertState({...alertState, show : true, ...payload});
        setTimeout(() => {
            setAlertState({...alertState, show : false})
        }, delay)
    }  
    
    return <AlertProvider value={{
        ...AlertContext,
        ...alertState,
        onAlert
    }}>
       <Alert show={alertState.show}  message={alertState}/> 
       {children}
    </AlertProvider>
}


export {AlertContext, AlertConsumer};