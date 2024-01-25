var myProject = [{id: '1', name: 'pj1'}, {id: '2', name: 'pj2'}];
var myTable = [];
var myCard = [];
var projectId, tableId, cardId = 0;

function project(id, name) {
    this.id = id,
    this.name = name
}

function table(id, name, projectId) {
    this.id = id,
    this.name = name
    this.projectId = projectId
}

function project(id, name, tableId) {
    this.id = id,
    this.name = name
    this.tableId = tableId
}

$("input#search-create-project").on("keyup", function(){
    var inputValue = $(this).val();
    var filteredDate = myProject.filter(function (item){
        return item.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    })
    var html = '';
    filteredDate.forEach(function (item,index) {
        html += `<li class = "${item.id}">${item.name}</li>`
    })
    $("#project-dropdown").append(html);
})

$(document).on("click", "button.create-table-confirm", function(){
    alert("clicked")
    var table_added_html = 
    `<li>
        <ul class="table">
            <li class="table-title disable">Table title 1</li>
            <li class="card">Card 1</li>
            <li class="card">Card 2</li>
            <li class="card">Card 3</li>
            <li class="disable"><button class="add-card"> Add a card</button></li>
        </ul>
    </li>`;
    var add_table_button =
        `<li><button type="button" class="add-table btn btn-default" style="margin-top: 8px !important;">
            <span class="glyphicon glyphicon-plus"></span> Add another list</button>
        </li>`
    $(".table-list").children().last().before(table_added_html);
    $("ul.table-list .create-table").remove()
    $(".table-list").append(add_table_button)
})


//table
$(document).on("click", ".table-list button.add-table", function () {
    console.log($(".table-list").children().last())
    var html = 
        `<div class="create-table">
          <input class="create-table-input"/>
          <button class="create-table-confirm">v</button>
          <button class="create-table-close">x</button>
        </div>    `;
    $(".table-list").children().last().before(html);
    $(this).remove()
})

//card
$(".add-card").on("click", function () {
    var html = `<li><input class="card-input" type="text"></li>`;
    $(".table").find("button").before(html);
    $(".add-card").addClass("disvisable");
})

$(document).on("keydown", "input.card-input", function (e) {
    var html = `<li class="card">${$(this).val()}</li>`;
    console.log(html)
    if (e.which === 13) {
        alert($(this).val());
        // Thêm xử lý tại đây
        $(".add-card").removeClass("disvisable");
        $(this).before(html);
        $(this).remove();
    }
})

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