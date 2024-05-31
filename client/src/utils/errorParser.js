function errorParser(error){
    const errorMessage = error?.response?.data.match(/<pre>(.*?)<\/pre>/)?.[1];
    const regex = /Error: (.+?)<br>/;
    const match = regex.exec(errorMessage);
    const extractedErrorMessage = match ? match[1] : "Unknown error";
    return extractedErrorMessage
}

export {errorParser}