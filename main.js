var url = location.href;
var sessionData = [];
let o_versions = DATA.server_origin;
let versions = DATA.server_origin;

// 每屆排名
function rankFunction() {
    let rank = document.getElementById("rank");
    rank.innerHTML = '';

    for (let i = 0; i < versions.length; i++) {
        let tr = document.createElement('tr');
        let version = document.createElement('td');
        version.innerHTML = `第${levelFrom + i + 1}屆`;
        tr.appendChild(version);

        for (let j = 0; j < versions[i].length; j++) {
            let td = document.createElement('td');
            td.innerHTML = versions[i][j];
            tr.appendChild(td);
        }
        rank.appendChild(tr)
    }
}
// 出現次數排名
function showFunction() {
    let showRank = document.getElementById("showRank");
    let showMap = [];
    showRank.innerHTML = '';

    for (let i = 0; i < versions.length; i++) {
        for (let j = 0; j < versions[i].length; j++) {
            if (versions[i][j] == "") continue;

            let target = showMap.find(value => value.name == versions[i][j]);

            if (target == undefined) {
                showMap.push({
                    "name": versions[i][j],
                    "times": 1
                });
            } else {
                target.times += 1;
            }
        }
    }

    if (showMap.length == 0) return;

    let sortArray = showMap.sort(function (a, b) {
        if (a.times > b.times) return -1;
        if (a.times < b.times) return 1;
        return 0;
    });

    let tr = document.createElement('tr');

    for (let i = 0; i < 16; i++) {
        let td = document.createElement('td');
        td.innerHTML = sortArray[i].name;
        tr.appendChild(td);
    }
    showRank.appendChild(tr)
}
// 加權排名
function rankToPoint(rank) {
    if (rank == 0) return 5;
    else if (rank >= 1 && rank <= 2) return 4;
    else if (rank >= 3 && rank <= 4) return 3;
    else if (rank >= 4 && rank <= 8) return 2;
    else return 1;
}
function pointFunction() {
    let pointRank = document.getElementById("pointRank");
    let pointMap = [];
    pointRank.innerHTML = '';

    for (let i = 0; i < versions.length; i++) {
        for (let j = 0; j < versions[i].length; j++) {
            if (versions[i][j] == "") continue;

            let target = pointMap.find(value => value.name == versions[i][j]);

            if (target == undefined) {
                pointMap.push({
                    "name": versions[i][j],
                    "point": rankToPoint(j)
                });
            } else {
                target.point += rankToPoint(j);
            }
        }
    }

    if (pointMap.length == 0) return;

    let sortArray = pointMap.sort(function (a, b) {
        if (a.point > b.point) return -1;
        if (a.point < b.point) return 1;
        return 0;
    });

    let tr = document.createElement('tr');

    for (let i = 0; i < 16; i++) {
        let td = document.createElement('td');
        td.innerHTML = sortArray[i].name;
        tr.appendChild(td);
    }
    pointRank.appendChild(tr)
}
// 刷新面板
function refresh(e, server) {

    if (server == 'origin') {
        o_versions = DATA.server_origin
    } else if (server == 'terra') {
        o_versions = DATA.server_terra;
    }
    updateRecentSliderBar();
    sessionData_recent = {
        id: "recent",
        value: parseInt(document.getElementsByClassName("recentSlider")[0].value)
    };

    versions = o_versions.slice(o_versions.length - sessionData_recent.value, o_versions.length);
    levelFrom = Math.max(0, o_versions.length - sessionData_recent.value);
    refreshRecentValue(sessionData_recent.value);

    rankFunction();
    showFunction();
    pointFunction();
}
// 刷新近幾屆
function refreshRecentValue(value) {
    document.getElementById("recentValue").text = `近${value}屆:`;
}
// 更新recentSliderBar
function updateRecentSliderBar() {
    let recentSlider = document.getElementsByClassName("recentSlider")[0];

    if (o_versions.length == 0) {
        recentSlider.setAttribute("min", 0);
        recentSlider.setAttribute("max", 0);
        recentSlider.setAttribute("value", 0);
        recentSlider.setAttribute("step", 0);
    } else {
        recentSlider.setAttribute("min", 1);
        recentSlider.setAttribute("max", o_versions.length);
        recentSlider.setAttribute("value", o_versions.length);
        recentSlider.setAttribute("step", 1);
    }
}

//程序進入點
if (url.indexOf('?') != -1) {
    var ary1 = url.split('?');
    var ary2 = ary1[1].split('&');
    for (let i = 0; i < ary2.length; i++) {
        let ary3 = ary2[i].split('=');
        sessionData.push({
            id: ary3[0],
            value: ary3[1]
        })
    }
}

let sessionData_server = sessionData.find(data => data.id == "server")
if (sessionData_server) {
    if (sessionData_server.value == "origin") {
        o_versions = DATA.server_origin;
    } else if (sessionData_server.value == "terra") {
        o_versions = DATA.server_terra;
    } else {
        o_versions = [];
    }
    updateRecentSliderBar();
}

let sessionData_recent = sessionData.find(data => data.id == "recent");
let levelFrom = 0;
if (sessionData_recent) {
    versions = o_versions.slice(o_versions.length - sessionData_recent.value, o_versions.length);
    levelFrom = Math.max(0, o_versions.length - sessionData_recent.value);
    refreshRecentValue(sessionData_recent.value);
} else {
    versions = o_versions;
    refreshRecentValue(o_versions.length);
}

if (versions.length != 0) {
    rankFunction();
    showFunction();
    pointFunction();

}