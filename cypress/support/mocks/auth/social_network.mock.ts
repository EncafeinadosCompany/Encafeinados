
export interface socialNetwork {
    social: 
        {
            id: number,
            name: string
        }[]
    
}


export const socialNetworkMock: socialNetwork = {
    social: [
        {
            id: 1,
            name: "facebook"
        },
        {
            id: 2,
            name: "instagram"
        }
    ]
}



