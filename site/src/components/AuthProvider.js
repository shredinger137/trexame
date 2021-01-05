

import { useUser } from 'reactfire';

const AuthProvider = (props) => {

    const { data: user } = useUser();
    if(user && user.displayName !== props.username){
        props.getData(user);
    }
    
    return null;
}

export default AuthProvider