    var myProject = [];
    var myTable = [];
    var myCard = [];
    var projectId,  tableId,  cardId

    loadData()


    //create-search-input => show list project
    $(".search-create-btn").on("click", function () {
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
        }
        $("#project-dropdown-list").append(html);
    })


    //create-search-btn click event
    $(document).on("click", "#create-pj-btn", function () {
        var myProjectName = $(this).val();
        var html = '';
        var project = {
            id: 'id' + Date.now(),
            name: myProjectName
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
        myTable.push(table);
        // localStorage save
        var jsonString = JSON.stringify(myTable);
        localStorage.setItem("table", jsonString);

        var table_added_html =
            `<li>
            <ul id="${table.id}" class="table">
                <li class="table-title disable">${table.name}</li>
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


    //add-table-btn click event
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

    //card add-btn click
    $(".add-card").on("click", function () {
        var html = `<li><input class="card-input" type="text"></li>`;
        $(".table").find("button").before(html);
        $(".add-card").addClass("disvisable");
    })

    // add card input
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

    //Load data
    function loadData(projectId = "1") {
        var html = `<ul id="1" class="table-list">`;

        //get data from local storage
        myTable = JSON.parse(localStorage.getItem("table"));
        myCard = JSON.parse(localStorage.getItem("card"));
        console.log(myTable);
        console.log(myCard);

        var tableList = myTable.filter(function (project) {
            return project.projectId == projectId;
        })
        console.log(tableList)
        tableList.forEach(function (table) {
            html += `
            <li>
                <ul class="table">
                    <li id="${tableId}" class="table-title disable">${table.name}</li>`
                    if(myCard){
                        myCard.forEach(function(card){
                            `<li id="${card.id}" class="card">${card.name}</li>`;
                        })
                    }
            html +=        `<li class="card">Card 1</li>
                    <li class="card">Card 2</li>
                    <li class="card">Card 3</li>`
            html +=`<li class="disable"><button class="add-card"> Add a card</button></li>
                </ul>
            </li>`;
        })
        html += `<li><button type="button" class="add-table btn btn-default" style="margin-top: 8px !important;">
                    <span class="glyphicon glyphicon-plus"></span> Add a list</button>
                 </li>
            </ul>`;
        $("div.body").append(html);
        console.log($("div.body"))

    }