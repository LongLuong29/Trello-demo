            var projectId = JSON.parse(localStorage.getItem('projectId'))
            var tableId, cardId

            var myCard = [];
            var myTable = [];
            var myProject = [];
            var cardsListInTable = {}

            if (localStorage.getItem('table') && localStorage.getItem('card')) {
                myTable = JSON.parse(localStorage.getItem('table'));
                myCard = JSON.parse(localStorage.getItem('card'));
                cardListJson = localStorage.getItem('cardsListInTable')
                if (cardListJson) {
                    cardsListInTable = JSON.parse(cardListJson)
                }
                myTable.forEach(function (table) {
                    if (!cardsListInTable[table.id]) {
                        cardsListInTable[table.id] = [];
                        myCard.forEach(function (card) {
                            if (card.tableId == table.id) {
                                cardsListInTable[table.id].push(card);
                            }
                        });
                    }
                })
                localStorage.setItem('cardsListInTable', JSON.stringify(cardsListInTable))
            }
            loadData();
            sortCard();

            //create-search-input => show list project
            $(document).on("click", ".search-create-btn", function () {
                myProject = JSON.parse(localStorage.getItem('project'));
                $("#project-dropdown-list").empty();
                $("#search-create-project").val('');
                var jsonString = localStorage.getItem("project");
                myProject = JSON.parse(jsonString);
                var html = ``;
                if (jsonString) {
                    if (myProject.length <= 1) {
                        html += `<li id="project0" class="project-item">
                        <span class="project-name">${myProject[0].name}</span>
                        <button class="delete-project" type="button">
                        <span class="glyphicon glyphicon-trash"></span></button></li>`;
                    } else {
                        for (const item of myProject) {
                            html += `<li id="project${item.id}" class="project-item">
                            <span class="project-name">${item.name}</span>
                            <button class="delete-project" type="button">
                            <span class="glyphicon glyphicon-trash"></span></button></li>`;
                        }
                    }
                    $("#project-dropdown-list").append(html);
                }
            })

            //delete project
            $(document).on('click', 'button.delete-project', function () {

                myProject = JSON.parse(localStorage.getItem('project'));
                myTable = JSON.parse(localStorage.getItem('table'));
                myCard = JSON.parse(localStorage.getItem('card'));

                currentProjectId = $(this).closest('li.project-item').attr('id').split('project')[1];
                console.log(currentProjectId);
                console.log(myCard)

                //remove tables and cards in this project
                var myNewTables = []
                var myNewCards = [];
                myTable.forEach(function (table) {
                    if (table.projectId !== currentProjectId) {
                        myNewTables.push(table);
                        // myCard.forEach(function(card){
                        //     if(card.tableId == table.id){
                        //         myNewCards.push(card);
                        //     }
                        // })
                    }
                })
                myTable = myNewTables;
                localStorage.setItem('table', JSON.stringify(myNewTables));
                // localStorage.setItem('card', JSON.stringify(myNewCards));

                //remove myProject and save on localstorage
                removeObjectById(myProject, currentProjectId)
                localStorage.setItem('project', JSON.stringify(myProject));

                let changedProjectId = JSON.stringify(myProject[0].id)
                localStorage.setItem('projectId', JSON.stringify(changedProjectId));
                loadData(changedProjectId);
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
                myCardJson = localStorage.getItem('card')
                if(myCardJson){myCard = JSON.parse(myCardJson);}
                cardListJson = localStorage.getItem('cardsListInTable')
                if (cardListJson) {cardsListInTable = JSON.parse(cardListJson)}
                if (e.which === 13) {
                    if ($(this).val()) {
                        var card = {
                            id: 'id' + Date.now(),
                            name: $(this).val(),
                            tableId: $(this).closest("ul.table").attr("id")
                        }
                        var html = `<li id ='${card.id}' class="card">${$(this).val()}
                        <button type="button" ng-click="removeRow(newDelivery.transactions, $index)" class="close icon-white delete-card " aria-hidden="true">&times;</button>
                        </li>`;
                        if(!cardsListInTable[card.tableId]){
                            cardsListInTable[card.tableId] = [card];
                            localStorage.setItem("cardsListInTable", JSON.stringify(cardsListInTable))
                        }else{
                            cardsListInTable[card.tableId].push(card);
                            localStorage.setItem("cardsListInTable", JSON.stringify(cardsListInTable))
                        }
                        if (!myCard) {
                            myCard = [card];
                        } else {
                            myCard.push(card);
                        }
                        var jsonString = JSON.stringify(myCard);
                        localStorage.setItem("card", jsonString);
                        localStorage.setItem("cardsListInTable", JSON.stringify(cardsListInTable))
                        $(this).closest(".disable").before(html);
                        console.log($(this))
                        console.log($(this).closest("disable"))
                    }
                     // Xu ly giao dien sau khi nhan enter
                     $(".add-btn-" + $(this).closest("ul.table").attr("id")).removeClass("disvisable");
                     $(this).remove();
                }
            })

            // project dropdown li click => choose project
            $(document).on("click", "li.project-item", function () {
                var myProjectId = $(this).attr("id").split("project")[1];
                loadData(myProjectId)
            })


            // delete card
            $(document).on("click", "button.delete-card", function () {
                cardListJson = localStorage.getItem('cardsListInTable')
                if (cardListJson) {
                    cardsListInTable = JSON.parse(cardListJson)
                }
                myCard = JSON.parse(localStorage.getItem('card'));
                $(this).closest("li").remove();
                var cardIddd = $(this).closest("li").attr("id");

                deletedCard = findObjectInArrayByID(myCard, cardIddd);
                removeObjectById(cardsListInTable[deletedCard.tableId], cardIddd)
                removeObjectById(myCard, cardIddd);

                var jsonString = JSON.stringify(myCard)
                localStorage.setItem("card", jsonString);
                localStorage.setItem("cardsListInTable", JSON.stringify(cardsListInTable))
            })

            function removeObjectById(arrayList, targetId) {
                const index = arrayList.findIndex(obj => obj.id === targetId);
                if (index !== -1) {
                    arrayList.splice(index, 1);
                }
                return arrayList;
            }

            //delete table 
            $(document).on("click", "a.delete-table", function () {
                myTable = JSON.parse(localStorage.getItem('table'));
                myCard = JSON.parse(localStorage.getItem('card'));

                $(this).closest("ul.table").remove();
                var tableIddd = $(this).closest("ul.table").attr("id");

                var myNewCard = []
                myCard.forEach(function (card) {
                    if (card.tableId !== tableIddd) {
                        myNewCard.push(card);
                    }
                })
                removeObjectById(myTable, tableIddd);
                myCard = myNewCard;

                var jsonString = JSON.stringify(myTable)
                localStorage.setItem("table", jsonString);
            })

            //exception projectID 
            function checked() {
                myProject = JSON.parse(localStorage.getItem('project'));
                jsonString = localStorage.getItem('projectId');
                if (jsonString) {
                    var projectId = JSON.parse(jsonString);
                    localStorage.setItem('projectId', projectId);
                } else {
                    var newProject = [{
                        id: 'id' + Date.now(),
                        name: "My New Board"
                    }]
                    myProject = newProject
                    projectId = newProject.id
                    alert(projectId)
                    localStorage.setItem('project', JSON.stringify(myProject))
                    localStorage.setItem('projectId', JSON.stringify(projectId));
                }
                loadData(projectId);
            }


            //Load data
            function loadData(projectId = JSON.parse(localStorage.getItem('projectId'))) {
                if (!projectId) {
                    myProject = JSON.parse(localStorage.getItem('project'));
                    var newProject = [{
                        id: 'id' + Date.now(),
                        name: "My New Board"
                    }]
                    myProject = newProject
                    projectId = newProject[0].id
                    alert(projectId)
                    localStorage.setItem('project', JSON.stringify(myProject))
                }

                cardListJsonString = localStorage.getItem('cardListJsonString')
                cardsListInTable = JSON.parse(localStorage.getItem('cardsListInTable'))

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
                                        <li class="table-title disable"><div class="table-name">${table.name}</div>
                                            <div class="dropdown">
                                                <button class="edit-delete-card-btn btn btn-default text-right dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                <span class="glyphicon glyphicon-option-horizontal"></span>
                                                </button>
                                                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                                    <li><a class="edit-table ${table.id}" href="#">Edit</a></li>
                                                    <li><a class="delete-table ${table.id}" href="#">Delete</a></li>
                                                </ul>
                                            </div>
                                        </li><li class="disvisable card"></li>`
                        if (cardsListInTable) {
                            cardsListInTable[table.id].forEach(function (card) {
                                if (card.tableId == table.id) {
                                    html +=
                                        `<li id="${card.id}" class="card">${card.name}
                                        <button type="button" ng-click="removeRow(newDelivery.transactions, $index)" class="close icon-white delete-card " aria-hidden="true">&times;</button>
                                    </li>`;
                                }
                            })
                        }
                        html += `<li class="disvisable"></li>
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


            //edit-table-name button click
            $(document).on('click', "li.table-title a.edit-table", function(){
                var tableName = $(this).closest("li.table-title").find("div.table-name");
                var btn = $(this).closest("li.table-title").find("button.edit-delete-card-btn")
                var html = `<input class=edit-table-title type="text" style="width: 216px; padding: 0px; margin: 0px !important; place" placeholder="${tableName.val()}">`

                tableName.before(html)
                tableName.addClass("disvisable")
                btn.addClass("disvisable")
            } )

            //edited table name
            $(document).on("keydown", "input.edit-table-title", function(e) {

                var tableJsonString = localStorage.getItem("table");
                if(tableJsonString){myTable = JSON.parse(tableJsonString)}
                if(e.which == 13) {
                    var thisValue = $(this).val();
                    var thisTableName = $(this).closest("li.table-title").find("div.table-name")
                    var btn = $(this).closest("li.table-title").find("button.edit-delete-card-btn")
                    var thisTable = findObjectInArrayByID(myTable, thisTableName.closest("ul.table").attr("id"))

                    //html handle
                    thisTableName.text(thisValue)
                    thisTableName.removeClass("disvisable")
                    btn.removeClass("disvisable")
                    $(this).remove()

                    //edit table namethisValue
                    thisTable.name = thisValue;
                    localStorage.setItem("table", JSON.stringify(myTable));
                }
            })

            function findObjectInArrayByID(obj_arr, obj_id) {
                return obj_arr.find(obj => obj.id === obj_id)
            }



            function sortCard(){

            $(".sortable").sortable({

                connectWith: ".sortable",
                placeholder: "ui-state-highlight",
                items: '>li:not(.disabled):not(:first-child):not(:last-child)',
                active: function (e, ui) {

                },
                receive: function (event, ui) {

                },
                stop: function(event, ui) {
                    var sortedIndex = ui.item.index() - 2;
                    cardsListInTable = JSON.parse(localStorage.getItem('cardsListInTable'));

                    var fromTableId = event.target.id;
                    var toTableId = ui.item.closest('ul.table').attr('id')
                    var sortedCard = findObjectInArrayByID(myCard, ui.item.attr('id'));

                    if(fromTableId !== toTableId){
                        var tableReceived = findObjectInArrayByID(myTable, toTableId);

                        removeObjectById(cardsListInTable[sortedCard.tableId], sortedCard.id)

                        //reassign tableID for card, removed card form old table
                        sortedCard.tableId = toTableId;

                        // added card to new table
                        cardsListInTable[tableReceived.id].splice(sortedIndex, 0, sortedCard);
                        localStorage.setItem('cardsListInTable', JSON.stringify(cardsListInTable))

                        //push card into new table
                        var jsonString = JSON.stringify(myCard);
                        localStorage.setItem("card", jsonString);
                    }
                    else {
                        var tableSorted = findObjectInArrayByID(myTable, toTableId);
                        var movedCardIndex = cardsListInTable[toTableId].findIndex(function (obj) {
                            return obj.id === ui.item.attr('id');
                        })
                        var movedCardItem = cardsListInTable[toTableId].splice(movedCardIndex,1)[0];
                        cardsListInTable[tableSorted.id].splice(sortedIndex, 0, movedCardItem);
                        localStorage.setItem('cardsListInTable', JSON.stringify(cardsListInTable))
                    }
                }
            }).disableSelection();

        }