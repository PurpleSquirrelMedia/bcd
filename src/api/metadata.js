const axios = require('axios').default;

export class RequestFailedError extends Error { }

export class MetadataAPI {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 10000,
            responseType: 'json'
        });
    }

    get(network, address) {
        let query = {
            "query":`query GetContractMetadata($address: String, $network: String) {
                contract_metadata(
                    where: {contract: {_eq: $address}, network: {_eq: $network}}
                ) {
                    network
                    contract
                    error
                    link
                    metadata
                    retry_count
                    status
                }
            }`,
            "variables": {
              "address":`${address}`,
              "network":`${network}`,
            },
            "operationName":"GetContractMetadata"
        }

        return this.api.post("v1/graphql", query)
            .then((res) => {
                if (res.status !== 200) {
                    throw new RequestFailedError(res);
                }
                if (res.data.data.contract_metadata.length > 0) {
                    return res.data.data.contract_metadata[0]
                }
                return null
            })
    }
}