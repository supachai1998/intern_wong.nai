import useSWR from 'swr'
import {fetcher} from '../uliti/fetcher'
const api = 'http://localhost:5000/trips'
export  const useFetch = (para = "") =>{
    return useSWR(api+para, fetcher)
}