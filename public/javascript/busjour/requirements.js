let processes = [];
let features = [];
let modules = [];
let moscow = []

const populateSelections = async function() {
    await $.ajax({
        url: '../../api/journey/processes',
        type: 'GET',
        success: function(data, status) {
            for (i in data) {
                processes.push({value: data[i].id, text: data[i].process})
            }
        },
        error: function(data, status) {
            console.log(status);
        }
    });
    await $.ajax({
        url: '../../api/journey/features',
        type: 'GET',
        success: function(data, status) {
            for (i in data) {
                features.push({value: data[i].id, text: data[i].feature_name})
            }
        },
        error: function(data, status) {
            console.log(status);
        }
    });
    await $.ajax({
        url: '../../api/journey/modules',
        type: 'GET',
        success: function(data, status) {
            for (i in data) {
                modules.push({value: data[i].id, text: data[i].module_name + ' | ' + data[i].sub_module_name})
            }
        },
        error: function(data, status) {
            console.log(status);
        }
    });
    await $.ajax({
        url: '../../api/journey/moscow',
        type: 'GET',
        success: function(data, status) {
            for (i in data) {
                moscow.push({value: data[i].moscow, text: data[i].moscow})
            }
        },
        error: function(data, status) {
            console.log(status);
        }
    });
    return [processes, features, modules, moscow];
}
const populateTable = async function(processes, features, modules, moscow) {
    $.fn.editable.defaults.mode = 'inline';
    let href = location.href;
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_requirements/' + href.substr(href.lastIndexOf('/') + 1),
        idField: 'id',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 700,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        },{
            field: 'requirement_id',
            title: 'Std Requirement',
            visible: false

        }, {
            field: 'process_id',
            title: 'Process',
            sortable: true,
            editable: {
                type: 'select',
                source: processes
            }
        }, {
            field: 'sub_module_id',
            title: 'Module',
            sortable: true,
            editable: {
                type: 'select',
                source: modules
            }
        },{
            field: 'requirement',
            title: 'Requirement',
            filterControl: 'input',
            editable: {
                type: 'textarea'
            }
        }, {
            field: 'moscow',
            title: 'MoSCoW',
            sortable: true,
            filterControl: 'input',
            editable: {
                type: 'select',
                source: moscow
            }
        }, {
            field: 'is_key_requirement',
            title: 'Key',
            sortable: true,
            editable: {
                type: 'select',
                source: [{value: 1, text: 'Yes'}, {value: 0, text: 'No'}]
            },
            halign: 'center',
            align: 'center'
        }, {
            field: 'push_to_standard',
            title: 'Create Standard',
            formatter: standardFormatter,
            visible: false
        }]
    });
    $table.on('editable-save.bs.table', function(e, field, row, old, $el){
        $.ajax({
            url: '../../api/journey/journey_requirement',
            type: 'POST',
            data: {
                journey_id: row['journey_id'],
                requirement_id: row['id'],
                update_field: field,
                update_value: row[field]
            },
            success: function(data, status){
                // $('#update_message').removeClass();
                // $('#update_message').addClass("alert alert-success text-center");
                // $('#update_message').text(data.message);
                // $('#update_message').delay(500).fadeIn('normal', function(){
                //     $(this).delay(2500).fadeOut();
                // })
            },
            error: function(data, status){
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-danger text-center");
                $('#update_message').text(data.error);
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            }
        });
    });
}

const standardFormatter = (value, row) => {
    if (row.requirement_id) {
        return ''
    } else {
        return `<button class="btn btn-primary" onclick="populateStandard(${row.journey_id}, ${row.id})">Create Standard</button>`;
    }

}

const populateStandard = (journey_id, requirement_id) => {
    $.ajax({
        url: '../../api/journey/create_standard',
        type: 'POST',
        data: {
            journey: journey_id,
            requirement: requirement_id
        },
        success: function(data, status) {
            $('#table').bootstrapTable('refresh');
        },
        error: function(data, status) {
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-danger text-center");
            $('#update_message').text(data.error);
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })


}

$(function(){
    populateSelections()
        .then((response) => {
            // console.log(response);
            populateTable(processes=response[0], features=response[1], modules=response[2], moscow=response[3]);
        })
})

const addRequirements = function() {
    let href = location.href;
    let requirements = $('#requirements').val();
    $.ajax({
        url: '../../api/journey/add_journey_requirements/' + href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        data: {
            requirements: requirements
        },
        success: function(data, status){
            $('#table').bootstrapTable('refresh');
            $('.selectpicker').selectpicker('deselectAll');
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-danger text-center");
            $('#update_message').text(data.error);
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    });
}