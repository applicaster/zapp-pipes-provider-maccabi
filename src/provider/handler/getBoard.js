import axios from 'axios';
import {
    parseXML,
    urlEncode
} from './utils';

export default ({
    c_type = '0'
}) => {
    const url = `https://www.maccabi.co.il/MaccabiServices/MaccabiServices.asmx/GetTable?c_type=${c_type}`;
    return axios.get(url).then(handlePlayersResponse).catch(e => Promise.reject());

};

function handlePlayersResponse(response) {
    const paersedResults = parseXML(response.data).Table;
    return {
        id: paersedResults._attributes.CompID,
        title: paersedResults._attributes.Name,
        type: {
            value: "feed"
        },
        entry: parseTeams(paersedResults.Team)
    }
}

function parseTeams(teams) {
    if (!teams) return []
    return teams.map(parseTeam)
}

function parseTeam(team) {
    return {
        type: {
            value: 'link'
        },
        id: team.TeamID._text,
        title: team.TeamShortName._cdata,
        summary: team.TeamName._cdata,
        link: {
            href: "",
            rel: "alternate",
            type: "link"
        },
        media_group: [{
            type: "image",
            media_item: [{
                src: team.TeamLogo._text,
                key: "image_base",
                type: "image"
            }]
        }],
        extensions: {
            Place: team.TableData.Place._text,
            Games: team.TableData.Games._text,
            Win: team.TableData.Win._text,
            Lose: team.TableData.Lose._text,
            Score: team.TableData.Score1._text,
            Score2: team.TableData.Score2._text,
            Diff: team.TableData.Diff._text,
            Pts: team.TableData.Pts._text
        }
    }
}