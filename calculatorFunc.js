class User{
    constructor(name,country){
        this.name = name;
        this.country = country;
    }
}

let initList = generateDistinctList();
let userList  =[];

function refreshNewUser() {
    let currentList = initList;
    let historyList = DATA.contrary;
    let newUserList = currentList.filter(x => {
        let result = historyList.find(item => item.name == x);
        if (result == null) {
            return true;
        } else {
            return false;
        }
    });
    
    
    if (newUserList == null || newUserList.length == 0) {
        document.getElementById("displayLabel").innerHTML = "目前沒有新參賽者";
    } else {
        let fakeUserList = newUserList.map(x => new User(x,"en"))
        document.getElementById("displayLabel").innerHTML = JSON.stringify(fakeUserList);
    }
}

function inintTable(language) {
    createTable(DATA.contrary.filter(x => x.country == language));
}

function createTable(array){
    let divElement = document.getElementById("filterTable");
    let table = document.createElement("table");
    table.className = "redTable";
    let column = 16;
    var row;
    divElement.innerHTML = "";
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (index % column == 0) {
            row = document.createElement("tr");
            table.appendChild(row);
        } else {
            let td = document.createElement("td");
            td.innerHTML = element.name;
            row.appendChild(td);
        }
    }
    divElement.appendChild(table);
}

/**
 * 產生所有歷屆排名的用戶以不重複的清單輸出
 * @returns 歷屆排名不重複的用戶清單
 */
function generateDistinctList(){
    let distinctList = [];
    console.log("test")
    let versions = DATA.server_origin;
    for (let index = 0; index < versions.length; index++) {
        const group = versions[index];
        
        for (let innerIndex = 0; innerIndex < group.length; innerIndex++) {
            const user = group[innerIndex];
            if (user == "") {
                continue;
            }
            if (distinctList.indexOf(user) == -1) {
                distinctList.push(user);    
            }
        }
    }

    return distinctList;
}