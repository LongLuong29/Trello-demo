var projectId, tableId, cardId

var myCard = [];
var myTable = [];
var myProject = [];
loadData()


//create-search-input => show list project
$(document).on("click", ".search-create-btn", function () {
    myProject = JSON.parse(localStorage.getItem('project'));
    $("#project-dropdown-list").empty();
    $("#search-create-project").val('');
    var jsonString = localStorage.getItem("project");
    myProject = JSON.parse(jsonString);
    var html = ``;
    if (jsonString) {
        for (const item of myProject) {
            html += `<li class="project-item">
            <span id="project${item.id}" class="project-name">${item.name}</span>
            <button class="delete-project" type="button"><span class="glyphicon glyphicon-trash"></span></button></li>`;
        }
        $("#project-dropdown-list").append(html);
    }
})

//create-search-input => searching
$(document).on("keyup", "input#search-create-project", function () {
    $("#project-dropdown-list").empty();
    var inputValue = $(this).val();
    var jsonString = localStorage.getItem("project");
    myProject = JSON.parse(jsonString);
    var html = '';
    if (jsonString) {
        var filteredData = myProject.filter(function (item) {
            return item.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        })
        filteredData.forEach(function (item, index) {
            html += `<li class = "${item.id}">${item.name}</li>`
        })
        if (filteredData.length == 0) {
            html += `<li class = "no-result">"${$(this).val()}" not found</li>`
            html += `<li><button id="create-pj-btn" value="${$(this).val()}">Create "${$(this).val()}"</button></li>`
        }
    } else {
        html += `<li class = "no-result">"${$(this).val()}" not found</li>`
        html += `<li><button id="create-pj-btn" value="${$(this).val()}">Create "${$(this).val()}"</button></li>`
    }
    console.log($(this).val())
    $("#project-dropdown-list").append(html);
})

//create-search-btn click event => create project
$(document).on("click", "#create-pj-btn", function () {
    myProject = JSON.parse(localStorage.getItem('project'));
    var myProjectName = $(this).val();
    var html = '';
    var project = {
        id: 'id' + Date.now(),
        name: myProjectName
    }
    if (!myProject) {
        myProject = []
    }
    myProject.push(project);

    // localStorage save
    var jsonString = JSON.stringify(myProject);
    localStorage.setItem("project", jsonString);

    //re-render html
    $("#project-dropdown-list").empty();
    myProject.forEach(function (item, index) {
        html += 
        `<li class = "${item.id}">${item.name}
            <div id="tableDropdown " class="dropdown">
                <button class="btn btn-default dropdown-toggle text-right" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    <span class="glyphicon glyphicon-option-horizontal"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                    <li><a class="edit-table ${item.id}" href="#">Edit</a></li>
                    <li><a class="delete-table ${item.id}" href="#">Delete</a></li>
                </ul>
            </div>
        </li>`
    })
    $("#project-dropdown-list").append(html);
})

//add-table-btn confirmation click
$(document).on("click", "button.create-table-confirm", function () {
    var jsonString = localStorage.getItem("table")
    myTable = JSON.parse(jsonString);
    var inputValue = $("input.create-table-input").val();
    var table = {
        id: 'id' + Date.now(),
        name: inputValue,
        projectId: $(this).closest("ul.table-list").attr("id")
    }
    if (!myTable) {
        myTable = []
    }
    myTable.push(table);
    // localStorage save
    var jsonString = JSON.stringify(myTable);
    localStorage.setItem("table", jsonString);

    var table_added_html =
        `<li>
                    <ul id="${table.id}" class="table sortable">
                        <li class="table-title disable">${table.name}
                            <div id="tableDropdown " class="dropdown">
                                <button class="btn btn-default text-right dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                <span class="glyphicon glyphicon-option-horizontal"></span>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                    <li><a class="edit-table ${table.id}" href="#">Edit</a></li>
                                    <li><a class="delete-table ${table.id}" href="#">Delete</a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="disable"><button class="add-card add-btn-${table.id}"> Add a card</button></li>
                    </ul>
                </li>`;
    var add_table_button =
        `<li><button type="button" class="add-table btn btn-default" style="margin-top: 8px !important;">
                        <span class="glyphicon glyphicon-plus"></span> Add another list</button>
                    </li>`
    $(".table-list").children().last().before(table_added_html);
    $("ul.table-list .create-table").remove();
    $("ul.table-list").append(add_table_button);
})

//add-table-btn rejection click
$(document).on("click", "button.create-table-close", function () {
    var add_table_button =
        `<li><button type="button" class="add-table btn btn-default" style="margin-top: 8px !important;">
                        <span class="glyphicon glyphicon-plus"></span> Add another list</button>
                    </li>`
    $("ul.table-list .create-table").remove()
    $(".table-list").append(add_table_button)
})

//add-table-btn click event
$(document).on("click", ".table-list button.add-table", function () {
    var html =
        `<div class="create-table">
                    <input class="create-table-input"/>
                    <button class="create-table-confirm">v</button>
                    <button class="create-table-close">x</button>
                    </div>    `;
    $(".table-list").children().last().before(html);
    $(this).remove()
})

//card add-btn click
$(document).on("click", ".add-card", function () {
    var html = `<li><input class="card-input" type="text"></li>`;
    $(this).before(html);
    $(this).addClass("disvisable");
})

// add card input - enter keydown
$(document).on("keydown", "input.card-input", function (e) {
    myCard = JSON.parse(localStorage.getItem('card'));
    if (e.which === 13) {
        if($(this).val()){
            var card = {
                id: 'id' + Date.now(),
                name: $(this).val(),
                tableId: $(this).closest("ul.table").attr("id")
            }
            var html = `<li id ='${card.id}' class="card">${$(this).val()}
            <button type="button" ng-click="removeRow(newDelivery.transactions, $index)" class="close icon-white delete-card " aria-hidden="true">&times;</button>
            </li>`;
            myCard.push(card);
            var jsonString = JSON.stringify(myCard);
            localStorage.setItem("card", jsonString);
            $(this).before(html);
        }
        // Xu ly giao dien sau khi nhan enter
        $(".add-btn-" + $(this).closest("ul.table").attr("id")).removeClass("disvisable");
        $(this).remove();
    }
})

// project dropdown li click => choose project
$(document).on("click", "span.project-name", function () {

    // console.log($(this).attr("id").split("project")[1]);
    var myProjectId = $(this).attr("id").split("project")[1];
    loadData(myProjectId)
})


// delete card
$(document).on("click", "button.delete-card", function(){
    myCard = JSON.parse(localStorage.getItem('card'));
    $(this).closest("li").remove();
    var cardIddd = $(this).closest("li").attr("id");
    console.log(cardIddd);

    removeObjectById(myCard, cardIddd);

    console.log(myCard);

    var jsonString = JSON.stringify(myCard)
    localStorage.setItem("card", jsonString); 
    console.log(JSON.parse(localStorage.getItem("card")));
})

function removeObjectById(arrayList, targetId) {
    const index = arrayList.findIndex(obj => obj.id === targetId);
    if (index !== -1) {
        arrayList.splice(index, 1);
    }
    return arrayList;
}

// $("li.card").hover(function(){
//     console.log($(this).closest("button").removeClass("disvisable"));
// })

//delete table 
$(document).on("click", "a.delete-table", function () {
    myTable = JSON.parse(localStorage.getItem('table'));
    myCard = JSON.parse(localStorage.getItem('card'));

    $(this).closest("ul.table").remove();
    var tableIddd =  $(this).closest("ul.table").attr("id");
        
    var myNewCard = []
    myCard.forEach(function(card){
        if(card.tableId !== tableIddd){
            myNewCard.push(card);
        }
    })
    removeObjectById(myTable, tableIddd);
    myCard = myNewCard;

    console.log(myCard);
    console.log(myTable)

    var jsonString = JSON.stringify(myTable)
    localStorage.setItem("table", jsonString); 
})

//edit table
$(document).on("click", "a.edit-table", function (){
    myTable = JSON.parse(localStorage.getItem('table'));
    var tableIddd =  $(this).closest("ul.table").attr("id");
    console.log(tableIddd);
})

//exception projectID 


//Load data
function loadData(projectId = JSON.parse(localStorage.getItem("projectId"))) {
    myCard = JSON.parse(localStorage.getItem('card'));
    myTable = JSON.parse(localStorage.getItem('table'));
    localStorage.setItem("projectId", JSON.stringify(projectId));
    $("div.body").empty();
    var html = `<ul id="${projectId}" class="table-list">`;

    if (myTable) {
        var tableList = myTable.filter(function (project) {
            return project.projectId == projectId;
        })
        tableList.forEach(function (table) {
            html += `
                        <li>
                        <ul id="${table.id}" class="table sortable">
                            <li class="table-title disable"><div class="table-name" contenteditable="true" >${table.name}</div>
                                <div id="tableDropdown " class="dropdown">
                                    <button class="btn btn-default text-right dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    <span class="glyphicon glyphicon-option-horizontal"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                        <li><a class="edit-table ${table.id}" href="#">Edit</a></li>
                                        <li><a class="delete-table ${table.id}" href="#">Delete</a></li>
                                    </ul>
                                </div>
                            </li><li class="disvisable card"></li>`
            if (myCard) {
                myCard.forEach(function (card) {
                    if (card.tableId == table.id) {
                        html += 
                        `<li id="${card.id}" class="card">${card.name}
                            <button type="button" ng-click="removeRow(newDelivery.transactions, $index)" class="close icon-white delete-card " aria-hidden="true">&times;</button>
                        </li>`;
                    }
                })
            }
            html += `<li class="disvisable></li>
            <li class="disable"><button class="add-card add-btn-${table.id}"> Add a card</button></li>
                            </ul>
                            </li>`;
        })
    }
    html += `<li><button type="button" class="add-table btn btn-default" style="margin-top: 8px !important;">
                    <span class="glyphicon glyphicon-plus"></span> Add a list</button>
                    </li>
                    </ul>`;
    $("div.body").append(html);
}

function findObjectInArrayByID(obj_arr, obj_id){
    return obj_arr.find(obj => obj.id === obj_id)
}

$(".sortable").sortable({
    connectWith: ".sortable",
    placeholder: "ui-state-highlight",
    items: '>li:not(.disabled):not(:first-child):not(:last-child)',
    active: function(e, ui){
        console.log($(this))
    },
    receive: function (event, ui) {
        var tableReceived = findObjectInArrayByID(myTable, $(this).attr('id'));
        var sortedIndex = ui.item.index()-1;
        var sortedCard = findObjectInArrayByID(myCard, ui.item.attr('id'));
        console.log(tableReceived);
        console.log(sortedCard);
        //reassign tableID for card, removed card form old table
        sortedCard.tableId = $(this).attr('id');

        //push card into new table
        var jsonString = JSON.stringify(myCard);
        localStorage.setItem("card", jsonString);
        console.log(sortedIndex);
        console.log(sortedCard);
        console.log(myCard)

    },
    stop: function (event, ui) {

    },
    update: function (event, ui){

    }
}).disableSelection();

