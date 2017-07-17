module.exports = (thread) => {
    let specificStats = {
        countries: {},
        trollCountries: {}
    }
    let extraCodes = ['AC', 'AN', 'BL', 'CF', 'CM', 'DM', 'EU', 'FC', 'GN', 'GY', 'JH', 'KN', 'MF', 'NB', 'NZ', 'PC', 'PR', 'RE', 'TM', 'TR', 'UN', 'WP']


    let extraFlags = {
        'AC': 'Anarcho-Capitalist',
        'AN': 'Anarchist',
        'BL': 'Black Nationalist',
        'CF': 'Confederate',
        'CM': 'Communist',
        'DM': 'Democrat',
        'EU': 'European',
        'FC': 'Fascist',
        'GN': 'Gadsden',
        'GY': 'Gay',
        'JH': 'Jihadi',
        'KN': 'Kekistani',
        'MF': 'Muslim',
        'NB': 'National Bolshevik',
        'NZ': 'Nazi',
        'PC': 'Hippie',
        'PR': 'Pirate',
        'RE': 'Republican',
        'TM': 'Templar',
        'TR': 'Tree Hugger',
        'UN': 'United Nations',
        'WP': 'White Supremacist'
    }

    for (let post of thread.posts) {
        if (post.country) {
            if (!specificStats.countries[post.country_name]) {
                specificStats.countries[post.country_name] = 0
            }
            specificStats.countries[post.country_name]++
        }
        if (post.troll_country) {
            if (!specificStats.trollCountries[post.country_name]) {
                specificStats.trollCountries[post.country_name] = 0
            }
            specificStats.trollCountries[post.country_name]++
        }
    }

    return specificStats
}