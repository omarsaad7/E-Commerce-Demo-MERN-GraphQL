import axios from 'axios'
import backendUrls from './StaticVariables/backEndUrls.json'
import staticVariables from './StaticVariables/StaticVariables.json'
import {  toast } from 'react-toastify'

export async function graphQLRequest(query, variables,token) {
        var data = JSON.stringify({
            query: query,
            variables: variables
          });
          
          var config = {
            method: 'post',
            url: backendUrls.host + backendUrls.graphQL.baseUri ,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': token
            },
            data : data
          };
          
          var errorReturned = false
          return await axios(config)
          .then((response) => {
            if(response.data.errors){
                if(response.data.errors[0].message)
                    toast.error(response.data.errors[0].message)
                else
                    toast.error(staticVariables.messages.somethingWrong)
            
                errorReturned = true
                throw new Error()
            }
            return response.data.data
          })
          .catch((error) => {
            if(!errorReturned){
                if(error.response && error.response.data && error.response.data.errors)
                toast.error(error.response.data.errors[0].message)
                else
                toast.error(staticVariables.messages.somethingWrong)
            }
            throw error
          })
        //   .then( (response) => {
        //     return response.data.data
        //     // console.log(response.data.data)
        //     // console.log(JSON.stringify(response.data));
        //   })
        //   .catch( (error) => {
        //     console.log(error);
        //   });
    }
 