var projectId, tableId, cardId

var myProject = JSON.parse(localStorage.getItem('project'));
var myTable = JSON.parse(localStorage.getItem('table'));
var myCard = JSON.parse(localStorage.getItem('card'));

loadData()


//create-search-input => show list project
$(document).on("click", ".search-create-btn", function () {
    $("#project-dropdown-list").empty();
    $("#search-create-project").val('');
    var jsonString = localStorage.getItem("project");
    myProject = JSON.parse(jsonString);
    var html = ``;
    if (jsonString) {
        for (const item of myProject) {
            html += `<li id="project${item.id}">${item.name}</li>`;
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
        html += `<li class = "${item.id}">${item.name}</li>`
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
                    <ul id="${table.id}" class="table">
                        <li class="table-title disable">${table.name}</li>
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
    var html = `<li><input class="card-input" type="text">
        <button type="button" ng-click="removeRow(newDelivery.transactions, $index)" class="close icon-white delete-card " aria-hidden="true">&times;</button>
    </li>`;
    $(this).before(html);
    $(this).addClass("disvisable");
})

// add card input - enter keydown
$(document).on("keydown", "input.card-input", function (e) {
    if (e.which === 13) {
        if($(this).val()){
            var html = `<li class="card">${$(this).val()}</li>`;
            var card = {
                id: 'id' + Date.now(),
                name: $(this).val(),
                tableId: $(this).closest("ul.table").attr("id")
            }
            if (!myCard) {
                myCard = []
            }
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
$(document).on("click", "#project-dropdown-list li", function () {
    // console.log($(this).attr("id").split("project")[1]);
    var myProjectId = $(this).attr("id").split("project")[1];
    loadData(myProjectId)
})

$(document).on("click", "button.delete-card", function(){
    $(this).closest("li").remove();
    console.log($(this).closest("li").attr("id"));
    myCard = myCard.filter(function(card){
        return card.id !== $(this).closest("li").attr("id");
    })
    console.log(myCard)
})

// $("li.card").hover(function(){
//     console.log($(this).closest("button").removeClass("disvisable"));
// })

//Load data
function loadData(projectId = JSON.parse(localStorage.getItem("projectId"))) {
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
                        <ul id="${table.id}" class="table">
                            <li class="table-title disable">${table.name}</li>`
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
            html += `<li class="disable"><button class="add-card add-btn-${table.id}"> Add a card</button></li>
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

$(document).on("sortable", ".table", {
    connectWith: ".connectedSortable",
    placeholder: "ui-state-highlight",
    items: '>li:not(.disabled)',
    receive: function (event, ui) {
        // Xử lý khi phần tử được kéo vào danh sách mới
        console.log("Phần tử " + ui.item.text() + " đã được kéo vào danh sách mới.");
    }
}).disableSelection();

// Drag and drop
$(".table").sortable({
    connectWith: ".connectedSortable",
    placeholder: "ui-state-highlight",
    items: '>li:not(.disabled)',
    receive: function (event, ui) {
        // Xử lý khi phần tử được kéo vào danh sách mới
        console.log("Phần tử " + ui.item.text() + " đã được kéo vào danh sách mới.");
    }
}).disableSelection();