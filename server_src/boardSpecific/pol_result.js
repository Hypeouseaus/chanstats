module.exports = (research) => {
    //console.log(research)
    /*
    for (let key in research.boardSpecific.countries) {
        console.log(key + " " + research.boardSpecific.countries[key])
    }
    */

    let result = {
        countries: {},
        trollCountries: {}
    }

    for (let key in research.boardSpecific.trollCountries) {
        result.trollCountries[key] = research.boardSpecific.trollCountries[key] / research.posts
    }

    for (let key in research.boardSpecific.countries) {
        result.countries[key] = research.boardSpecific.countries[key] / research.posts
    }

    return result
}