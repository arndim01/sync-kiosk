import { fetcher } from "../wrapper/fetch-wrapper";

export async function GetSyncAppStatus({url, token}){

    let result = null;
    try{    
        const result = await fetcher(url, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': token
            }
        });

        console.log(result);
        if( result ){
            return result;
        }
    }catch(e ){
        return result;
    }
    return result;
}
