import axios from "axios"

export const General_Info = async () =>{
    return new Promise ((resolve) => {
        setTimeout(()=>{
            resolve(axios.get('https://covid19.mathdro.id/api'))
        },1000);
    })
}

export const Confirmed_Cases = async () =>{
    return new Promise ((resolve) => {
        setTimeout(()=>{
            resolve(axios.get('https://covid19.mathdro.id/api/confirmed'))
        },1000);
    })
}

export const DailyUpdate = async () =>{
    return new Promise ((resolve) => {
        let date = new Date()
        setTimeout(()=>{
            resolve(axios.get(`https://covid19.mathdro.id/api/daily/${(date.getMonth()+1)+"-"+(date.getDate()-1)+"-"+date.getFullYear()}`))
        },1000);
    })
}

export const CountryData = async (country) =>{
    return new Promise ((resolve) => {
        setTimeout(()=>{
            resolve(axios.get(`https://covid19.mathdro.id/api/countries/${country}`))
        },1000);
    })
}

export const FilterData = async () =>{
    return new Promise ((resolve) => {
        let date = new Date()
        
        setTimeout(()=>{
            // let arr = []
            axios.get(`https://covid19.mathdro.id/api/daily/${(date.getMonth()+1)+"-"+(date.getDate()-1)+"-"+date.getFullYear()}`)
            .then(res=>{
                const arr = res.data.map(element=>{
                    // arr.push(element.countryRegion)
                    return element.countryRegion
                })
                const newdata = new Set(arr);
                resolve([...newdata])
            })
            
            
        },1000);
    })
}


export const GetData = async () => {
  
    return new Promise((resolve)=>{
  
    let date = new Date();
    let today =
      date.getMonth() + 1 + "-" + (date.getDate() - 1) + "-" + date.getFullYear();
    let url = `https://covid19.mathdro.id/api/daily/${today}`;
    setTimeout(()=>{
      resolve(axios.get(url))
    },500)
    })
  };
  